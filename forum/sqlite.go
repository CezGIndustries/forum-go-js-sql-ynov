package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/sessions"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

func DatabaseInit(folder string) *sql.DB {
	cronosDB, err := sql.Open("sqlite3", folder+"cronosDB.db")
	if err != nil {
		log.Fatal(err)
	}

	os.Chmod(folder+"cronosDB.db", 0770)

	logUsers := `
	CREATE TABLE IF NOT EXISTS logUsers (
			UniqueName TEXT(32) NOT NULL PRIMARY KEY,
			Email TEXT(256) NOT NULL UNIQUE,
			Password TEXT(64) NOT NULL
		);
	`

	_, err = cronosDB.Exec(logUsers)
	if err != nil {
		log.Fatal(err)
	}

	accountUsers := `
		CREATE TABLE IF NOT EXISTS accountUsers (
			UniqueName TEXT(32) NOT NULL PRIMARY KEY,
			Status TEXT(16) NOT NULL,
			Rank TEXT(16) NOT NULL,
			ProfilPicture TEXT NOT NULL,
			Banner TEXT NOT NULL,
			Biography TEXT(240) NOT NULL
		);
		CREATE TABLE IF NOT EXISTS tagUsers (
			Tag TEXT(64) NOT NULL,
			User REFERENCES accountUsers(UniqueName) 
		);
		CREATE TABLE IF NOT EXISTS follow (
			User REFERENCES accountUsers(UniqueName),
			FollowUser REFERENCES accountUsers(UniqueName)
		);
	`

	_, err = cronosDB.Exec(accountUsers)
	if err != nil {
		log.Fatal(err)
	}

	cron := `
		CREATE TABLE IF NOT EXISTS cron (
			ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			Creator REFERENCES accountUsers(UniqueName),
			Content TEXT(240) NOT NULL,
			ParentID INTEGER REFERENCES cron(ID)
		);
		CREATE TABLE IF NOT EXISTS timeLeft (
			ID INTEGER REFERENCES cron(ID),
			Year INTEGER(2) NOT NULL,
			Month INTEGER(1) NOT NULL,
			Day INTEGER(1) NOT NULL,
			Hour INTEGER(1) NOT NULL,
			Minute INTEGER(1) NOT NULL
		);
		CREATE TABLE IF NOT EXISTS tagCron (
			ID REFERENCES cron(ID),
			Tag TEXT(32) NOT NULL
		);
		CREATE TABLE IF NOT EXISTS cronLike (
			ID INTEGER REFERENCES cron(ID),
			User REFERENCES accountUsers(UniqueName)
		);
	`

	_, err = cronosDB.Exec(cron)
	if err != nil {
		log.Fatal(err)
	}

	return cronosDB
}

type UserLogin struct {
	UniqueName string `json:"uniqueName"`
	Email      string `json:"email"`
	Password   string `json:"password"`
}

const (
	DEFAULT_PP_PATH     = "static/img/others/default_pp.png"
	DEFAULT_BANNER_PATH = "static/img/others/default_banner.png"
)

func CreateNewUser(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			NewUser UserLogin
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &NewUser)
		_, err := cronosDB.Exec(`INSERT INTO logUsers (UniqueName, Email, Password) VALUES (?, ?, ?);`, NewUser.UniqueName, NewUser.Email, hashPassword(NewUser.Password))
		if err != nil {
			w.Write([]byte(`{ "ERROR":"409" }`))
		} else {
			cronosDB.Exec(`INSERT INTO accountUsers (UniqueName, Status, Rank, ProfilPicture, Banner, Biography) VALUES (?, ?, ?, ?, ?, ?);`, NewUser.UniqueName, "Free", "member", DEFAULT_PP, DEFAULT_BANNER, "")
			addSession(w, r, NewUser.UniqueName)
			w.Write([]byte(`{}`))
		}
	}
}

type GoogleUser struct {
	UniqueName    string
	ProfilPicture string
}

func GoogleLog(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			uniqueName string
			GoogleUser GoogleUser
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &GoogleUser)
		row := cronosDB.QueryRow(`SELECT UniqueName FROM accountUsers WHERE UniqueName = ?`, GoogleUser.UniqueName)
		if err := row.Scan(&uniqueName); err != nil {
			cronosDB.Exec(`INSERT INTO accountUsers (UniqueName, Status, Rank, ProfilPicture, Banner, Biography) VALUES (?, ?, ?, ?, ?, ?);`, GoogleUser.UniqueName, "Free", "member", GoogleUser.ProfilPicture, "./static/img/others/default_banner.png", "")
		}
		addSession(w, r, GoogleUser.UniqueName)
	}
}

func hashPassword(password string) string {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes)
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func DeleteUser(cronosDB *sql.DB) {
	cronosDB.Exec(`DELETE FROM logUsers WHERE UniqueName = '?';`, "uniqueName")
}

type PP_Bio struct {
	PP         string
	Banner     string
	Bio        string
	UniqueName string
}

func ModifyPPBio(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			PP_Bio PP_Bio
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &PP_Bio)
		cronosDB.Exec(`UPDATE accountUsers SET ProfilPicture = ? , Biography = ?,Banner = ? WHERE UniqueName = ?`, PP_Bio.PP, PP_Bio.Bio, PP_Bio.Banner, PP_Bio.UniqueName)
	}
}

func CheckUser(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			uniqueName, password string
			User                 UserLogin
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &User)
		row := cronosDB.QueryRow(`SELECT UniqueName, Password FROM logUsers WHERE UniqueName = ? OR Email = ?`, User.UniqueName, User.Email)
		if err := row.Scan(&uniqueName, &password); err != nil {
			w.Write([]byte(`{ "ERROR":"404" }`))
		} else {
			if checkPasswordHash(User.Password, password) {
				addSession(w, r, User.UniqueName)
				w.Write([]byte(`{}`))
			} else {
				w.Write([]byte(`{ "ERROR":"404" }`))
			}
		}
	}
}

type UserInfo struct {
	UniqueName, Status, Rank, ProfilPicture, Banner, Biography string
	Tag                                                        []string
	UFollow, FollowU                                           []string
}

func GetUser(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if ValidSession(w, r) {
			var (
				User UserInfo
			)
			session, _ := store.Get(r, "AUTH_TOKEN")
			User.UniqueName = session.Values["uniqueName"].(string)
			sqlStatement := fmt.Sprintf(`SELECT * FROM accountUsers WHERE UniqueName = '%s';`, User.UniqueName)
			row := cronosDB.QueryRow(sqlStatement)
			row.Scan(&User.UniqueName, &User.Status, &User.Rank, &User.ProfilPicture, &User.Banner, &User.Biography)
			response, _ := json.Marshal(User)
			w.Write(response)
		} else {
			w.Write([]byte(`{ "ERROR":"404" }`))
		}
	}
}

var store = sessions.NewCookieStore(PRIVATE_KEY)

func addSession(w http.ResponseWriter, r *http.Request, uniqueName string) {
	session, _ := store.Get(r, "AUTH_TOKEN")
	session.Values["authenticated"] = true
	session.Values["uniqueName"] = uniqueName
	session.Save(r, w)
}

func LeaveSession() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, _ := store.Get(r, "AUTH_TOKEN")
		session.Values["authenticated"] = false
		session.Values["uniqueName"] = ""
		session.Save(r, w)
	}
}

func ValidSession(w http.ResponseWriter, r *http.Request) bool {
	session, _ := store.Get(r, "AUTH_TOKEN")
	auth, ok := session.Values["authenticated"].(bool)
	return auth && ok
}

type Cron struct {
	ID       int    `json:"ID"`
	Creator  string `json:"creator"`
	Content  string `json:"content"`
	TimeLeft struct {
		Year, Month, Day, Hour, Minute int
	} `json:"timeLeft"`
	ParentID int      `json:"ParentID"`
	Tag      []string `json:"tag"`
	Likes    []string `json:"Likes"`
	Comments []int    `json:"Comments"`
}

func CreateCron(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if ValidSession(w, r) {
			var (
				Cron = Cron{}
			)
			body, _ := ioutil.ReadAll(r.Body)
			json.Unmarshal(body, &Cron)
			session, _ := store.Get(r, "AUTH_TOKEN")
			Cron.Creator = session.Values["uniqueName"].(string)
			result, _ := cronosDB.Exec(`INSERT INTO cron (Creator, Content, ParentID) VALUES (?, ?, ?);`, Cron.Creator, Cron.Content, Cron.ParentID)
			ID, _ := result.LastInsertId()
			if Cron.TimeLeft.Year != 0 {
				cronosDB.Exec(`INSERT INTO timeLeft (ID, Year, Month, Day, Hour, Minute) VALUES (?, ?, ?, ?, ?, ?);`, ID, Cron.TimeLeft.Year, Cron.TimeLeft.Month, Cron.TimeLeft.Day, Cron.TimeLeft.Hour, Cron.TimeLeft.Minute)
			} else {
				row := cronosDB.QueryRow(`SELECT Year, Month, Day, Hour, Minute FROM timeLeft WHERE ID = ?`, Cron.ParentID)
				row.Scan(&Cron.TimeLeft.Year, &Cron.TimeLeft.Month, &Cron.TimeLeft.Day, &Cron.TimeLeft.Hour, &Cron.TimeLeft.Minute)
			}
			for _, tag := range Cron.Tag {
				cronosDB.Exec(`INSERT INTO tagCron (ID, Tag) VALUES (?, ?);`, ID, tag)
			}
			response, _ := json.Marshal(ID)
			w.Write(response)
		} else {
			w.Write([]byte(`{ "ERROR":"403" }`))
		}
	}
}

func DeleteCron(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

func RedirectCron(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			Cron = Cron{}
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &Cron)
		sqlStatement := fmt.Sprintf(`SELECT Creator FROM cron WHERE ID = %v`, Cron.ID)
		row := cronosDB.QueryRow(sqlStatement)
		if err := row.Scan(&Cron.Creator); err != nil {
			w.Write([]byte(`{ "ERROR":"404" }`))
		} else {
			response := fmt.Sprintf(`{ "ID": %v, "User": "%v" }`, Cron.ID, Cron.Creator)
			w.Write([]byte(response))

		}
	}
}

func GetCron(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			Cron = Cron{}
			tag  string
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &Cron)
		sqlStatement := fmt.Sprintf(`SELECT * FROM cron WHERE ID = %v`, Cron.ID)
		row := cronosDB.QueryRow(sqlStatement)
		if err := row.Scan(&Cron.ID, &Cron.Creator, &Cron.Content, &Cron.ParentID); err != nil {
			w.Write([]byte(`{ "ERROR":"404" }`))
		} else {
			sqlStatement = fmt.Sprintf(`SELECT Year, Month, Day, Hour, Minute FROM timeLeft WHERE ID = %v`, Cron.ID)
			row = cronosDB.QueryRow(sqlStatement)
			row.Scan(&Cron.TimeLeft.Year, &Cron.TimeLeft.Month, &Cron.TimeLeft.Day, &Cron.TimeLeft.Hour, &Cron.TimeLeft.Minute)
			sqlStatement = fmt.Sprintf(`SELECT Tag FROM tagCron WHERE ID = %v`, Cron.ID)
			rows, _ := cronosDB.Query(sqlStatement)
			for rows.Next() {
				rows.Scan(&tag)
				Cron.Tag = append(Cron.Tag, tag)
			}
			Cron.Comments = getComments(cronosDB, Cron)
			Cron.Likes = getLikes(cronosDB, Cron)
			response, _ := json.Marshal(Cron)
			w.Write(response)
		}
	}
}

func getLikes(cronosDB *sql.DB, Cron Cron) []string {
	var (
		user  string
		likes []string
	)
	sqlStatement := fmt.Sprintf(`SELECT User FROM cronLike WHERE ID = %v`, Cron.ID)
	rows, _ := cronosDB.Query(sqlStatement)
	defer rows.Close()
	for rows.Next() {
		rows.Scan(&user)
		likes = append(likes, user)
	}
	return likes
}

func getComments(cronosDB *sql.DB, Cron Cron) []int {
	var comments []int
	rows, _ := cronosDB.Query(`SELECT ID FROM cron WHERE ParentID = ?`, Cron.ID)
	defer rows.Close()
	for rows.Next() {
		rows.Scan(&Cron.ID)
		comments = append(comments, Cron.ID)
	}
	return comments
}

type Likes struct {
	ID int
}

func CreateLike(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			ID         Likes
			UniqueName string
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &ID)
		session, _ := store.Get(r, "AUTH_TOKEN")
		UniqueName = session.Values["uniqueName"].(string)
		sqlStatement := fmt.Sprintf(`SELECT * FROM cronLike WHERE ID = %v AND User = "%v"`, ID.ID, UniqueName)
		row, _ := cronosDB.Query(sqlStatement)
		if !row.Next() {
			row.Close()
			cronosDB.Exec(`INSERT INTO cronLike (ID, User) VALUES (?, ?);`, ID.ID, UniqueName)
		} else {
			row.Close()
			cronosDB.Exec(`DELETE FROM cronLike WHERE ID=? AND User=?;`, ID.ID, UniqueName)
		}
	}
}

type MultipleID struct {
	From int
	To   int
	IDs  []int
}

func GetMutlipleCronID(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if ValidSession(w, r) {
			var (
				IDs        MultipleID
				UniqueName string
				ID         int
			)
			body, _ := ioutil.ReadAll(r.Body)
			json.Unmarshal(body, &IDs)
			session, _ := store.Get(r, "AUTH_TOKEN")
			UniqueName = session.Values["uniqueName"].(string)
			rows, _ := cronosDB.Query(`SELECT C.ID FROM cron AS C
				LEFT JOIN follow AS F ON C.Creator = F.User
				LEFT JOIN tagCron AS TC ON C.ID = TC.ID
				LEFT JOIN tagUsers AS TU ON TU.User = ?
				WHERE C.Creator = ? OR F.FollowUser = ? OR TU.Tag = TC.Tag
				ORDER BY C.ID DESC;`, UniqueName, UniqueName, UniqueName, UniqueName)
			defer rows.Close()
			i := 0
			for rows.Next() && i < IDs.To {
				if IDs.From <= i {
					rows.Scan(&ID)
					IDs.IDs = append(IDs.IDs, ID)
				}
				i++
			}
			if i < IDs.To {
				IDs.IDs = append(IDs.IDs, -1)
			}
			response, _ := json.Marshal(IDs.IDs)
			w.Write(response)
		} else {
			w.Write([]byte(`{ "ERROR": 404 }`))
		}
	}
}

func AdminAccess(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if ValidSession(w, r) {
			var (
				UniqueName, Rank string
			)
			session, _ := store.Get(r, "AUTH_TOKEN")
			UniqueName = session.Values["uniqueName"].(string)
			row := cronosDB.QueryRow(`SELECT Rank FROM accountUsers WHERE UniqueName = ?`, UniqueName)
			if err := row.Scan(&Rank); err != nil || Rank == "member" {
				w.Write([]byte(`{"ERROR":403}`))
			} else {
				w.Write([]byte(`{}`))
			}
		} else {
			w.Write([]byte(`{"ERROR":403}`))
		}
	}
}

type Rank struct {
	Rank string
}

type AllUsers struct {
	AllUsers []User
}

type User struct {
	UniqueName, Status, Rank, ProfilPicture, Banner, Biography string
}

func GetAllUsers(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if ValidSession(w, r) {
			var (
				R    Rank
				AU   AllUsers
				U    User
				rows *sql.Rows
			)
			body, _ := ioutil.ReadAll(r.Body)
			json.Unmarshal(body, &R)
			if R.Rank == "administrator" {
				rows, _ = cronosDB.Query(`SELECT * FROM accountUsers WHERE NOT Rank = ? AND NOT Status = ? ORDER BY UniqueName ASC`, "administrator", "banned")
			} else {
				rows, _ = cronosDB.Query(`SELECT * FROM accountUsers WHERE NOT Rank = ? AND NOT Rank = ? AND NOT Status = ? ORDER BY UniqueName ASC`, "administrator", "moderator", "banned")
			}
			defer rows.Close()
			for rows.Next() {
				rows.Scan(&U.UniqueName, &U.Status, &U.Rank, &U.ProfilPicture, &U.Banner, &U.Biography)
				AU.AllUsers = append(AU.AllUsers, U)
			}
			response, _ := json.Marshal(AU)
			w.Write(response)
		}
	}
}

func GoDeleteCron(cronosDB *sql.DB) {
	for {
		var (
			ID  int
			IDs []int
		)
		date := time.Now()
		rows, _ := cronosDB.Query(`SELECT ID FROM timeLeft WHERE Year <= ? AND Month <= ? AND Day <= ? AND Hour <= ? AND Minute <= ?`, date.Format("2006"), date.Format("01"), date.Format("02"), date.Format("15"), date.Format("04"))
		for rows.Next() {
			rows.Scan(&ID)
			IDs = append(IDs, ID)
		}
		rows.Close()
		for _, i := range IDs {
			cronosDB.Exec(`DELETE FROM cron WHERE ID = ?`, i)
			cronosDB.Exec(`DELETE FROM timeLeft WHERE ID = ?`, i)
			cronosDB.Exec(`DELETE FROM tagCron WHERE ID = ?`, i)
			cronosDB.Exec(`DELETE FROM cronLike WHERE ID = ?`, i)
		}
		time.Sleep(time.Second * 30)
	}
}

type UN struct {
	UniqueName string
}

func CronUser(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			UN      UN
			Tag     string
			AllCron []Cron
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &UN.UniqueName)
		rows, _ := cronosDB.Query(`SELECT * FROM cron WHERE Creator = ?`, UN.UniqueName)
		for rows.Next() {
			var cronAlone Cron
			rows.Scan(&cronAlone.ID, &cronAlone.Creator, &cronAlone.Content, &cronAlone.ParentID)
			rowsTimeLeft := cronosDB.QueryRow(`SELECT Year, Month, Day, Hour, Minute FROM timeLeft WHERE ID = ?`, cronAlone.ID)
			rowsTimeLeft.Scan(&cronAlone.TimeLeft.Year, &cronAlone.TimeLeft.Month, &cronAlone.TimeLeft.Day, &cronAlone.TimeLeft.Hour, &cronAlone.TimeLeft.Minute)
			rowsTags, _ := cronosDB.Query(`SELECT Tag FROM tagCron WHERE ID = ?`, cronAlone.ID)
			for rowsTags.Next() {
				rowsTags.Scan(&Tag)
				cronAlone.Tag = append(cronAlone.Tag, Tag)
			}
			rowsTags.Close()
			cronAlone.Comments = getComments(cronosDB, cronAlone)
			cronAlone.Likes = getLikes(cronosDB, cronAlone)
			AllCron = append(AllCron, cronAlone)
		}
		rows.Close()
		response, _ := json.Marshal(AllCron)
		w.Write(response)
	}
}

func FriendCronUser(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			UN              UN
			UniqueName, Tag string
			AllCron         []Cron
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &UN.UniqueName)
		rows, _ := cronosDB.Query(`SELECT User FROM follow WHERE FollowUser = ?`, UN.UniqueName)
		for rows.Next() {
			rows.Scan(&UniqueName)
			rowsFriend, _ := cronosDB.Query(`SELECT * FROM cron WHERE Creator = ?`, UniqueName)
			for rowsFriend.Next() {
				var cronAlone Cron
				rowsFriend.Scan(&cronAlone.ID, &cronAlone.Creator, &cronAlone.Content, &cronAlone.ParentID)
				rowsFriendTimeLeft := cronosDB.QueryRow(`SELECT Year, Month, Day, Hour, Minute FROM timeLeft WHERE ID = ?`, cronAlone.ID)
				rowsFriendTimeLeft.Scan(&cronAlone.TimeLeft.Year, &cronAlone.TimeLeft.Month, &cronAlone.TimeLeft.Day, &cronAlone.TimeLeft.Hour, &cronAlone.TimeLeft.Minute)
				rowsFriendTags, _ := cronosDB.Query(`SELECT Tag FROM tagCron WHERE ID = ?`, cronAlone.ID)
				for rowsFriendTags.Next() {
					rowsFriendTags.Scan(&Tag)
					cronAlone.Tag = append(cronAlone.Tag, Tag)
				}
				rowsFriendTags.Close()
				cronAlone.Comments = getComments(cronosDB, cronAlone)
				cronAlone.Likes = getLikes(cronosDB, cronAlone)
				AllCron = append(AllCron, cronAlone)
			}
		}
		rows.Close()
		response, _ := json.Marshal(AllCron)
		w.Write(response)
	}
}

func TagCronUser(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			UN      UN
			Tag     string
			AllCron []Cron
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &UN)
		UN.UniqueName = "CezGain"
		rows, _ := cronosDB.Query(`SELECT DISTINCT cron.* FROM cron 
			LEFT JOIN tagCron ON cron.ID = tagCron.ID
			LEFT JOIN tagUsers ON tagUsers.User = ?
			WHERE tagCron.Tag = tagUsers.Tag`, UN.UniqueName)
		for rows.Next() {
			var cronAlone Cron
			rows.Scan(&cronAlone.ID, &cronAlone.Creator, &cronAlone.Content, &cronAlone.ParentID)
			rowsTimeLeft := cronosDB.QueryRow(`SELECT Year, Month, Day, Hour, Minute FROM timeLeft WHERE ID = ?`, cronAlone.ID)
			rowsTimeLeft.Scan(&cronAlone.TimeLeft.Year, &cronAlone.TimeLeft.Month, &cronAlone.TimeLeft.Day, &cronAlone.TimeLeft.Hour, &cronAlone.TimeLeft.Minute)
			rowsTags, _ := cronosDB.Query(`SELECT Tag FROM tagCron WHERE ID = ?`, cronAlone.ID)
			for rowsTags.Next() {
				rowsTags.Scan(&Tag)
				cronAlone.Tag = append(cronAlone.Tag, Tag)
			}
			rowsTags.Close()
			cronAlone.Comments = getComments(cronosDB, cronAlone)
			cronAlone.Likes = getLikes(cronosDB, cronAlone)
			AllCron = append(AllCron, cronAlone)
		}
		rows.Close()
		response, _ := json.Marshal(AllCron)
		w.Write(response)
	}
}

type UserInfoExist struct {
	UniqueName, Status, Rank, ProfilPicture, Banner, Biography string
}

func UserExists(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			UN   UN
			User UserInfoExist
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &UN)
		row := cronosDB.QueryRow(`SELECT * FROM accountUsers WHERE UniqueName = ?`, UN.UniqueName)
		if err := row.Scan(&User.UniqueName, &User.Status, &User.Rank, &User.ProfilPicture, &User.Banner, &User.Biography); err != nil {
			w.Write([]byte(`{"ERROR": 404}`))
		} else {
			response, _ := json.Marshal(User)
			w.Write(response)
		}
	}
}

func FamousTag(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			tag string
			id  int
		)
		allTag := make(map[string]int)
		rows, _ := cronosDB.Query(`SELECT DISTINCT * FROM tagCron`)
		for rows.Next() {
			rows.Scan(&id, &tag)
			allTag[tag] += 1
		}
		rows.Close()
		response, _ := json.Marshal(allTag)
		w.Write(response)
	}
}

func EveryTag(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			tag    string
			allTag []string
		)
		rows, _ := cronosDB.Query(`SELECT DISTINCT Tag FROM tagCron`)
		for rows.Next() {
			rows.Scan(&tag)
			allTag = append(allTag, tag)
		}
		rows.Close()
		response, _ := json.Marshal(allTag)
		w.Write(response)
	}
}

func EveryUser(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			UniqueName    string
			allUniqueName []string
		)
		rows, _ := cronosDB.Query(`SELECT UniqueName FROM accountUsers`)
		for rows.Next() {
			rows.Scan(&UniqueName)
			allUniqueName = append(allUniqueName, UniqueName)
		}
		rows.Close()
		response, _ := json.Marshal(allUniqueName)
		w.Write(response)
	}
}
