package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/sessions"
	_ "github.com/mattn/go-sqlite3"
)

type UserLogin struct {
	UniqueName string `json:"uniqueName"`
	Email      string `json:"email"`
	Password   string `json:"password"`
}

func DatabaseInit(folder string) *sql.DB {
	cronosDB, err := sql.Open("sqlite3", folder+"cronosDB.db")
	if err != nil {
		log.Fatal(err)
	}

	logUsers := `
		CREATE TABLE IF NOT EXISTS logUsers (
			UniqueName TEXT(32) NOT NULL PRIMARY KEY,
			Email TEXT(256) NOT NULL,
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
			ProfilPicture TEXT NOT NULL,
			Banner TEXT NOT NULL,
			Biography TEXT(240)
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
			Tag TEXT(360) NOT NULL,
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

func CreateNewUser(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			NewUser UserLogin
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &NewUser)
		_, err := cronosDB.Exec(`INSERT INTO logUsers (UniqueName, Email, Password) VALUES (?, ?, ?);`, NewUser.UniqueName, NewUser.Email, NewUser.Password)
		if err != nil {
			w.Write([]byte(`{ "ERROR":"409" }`))
		} else {
			cronosDB.Exec(`INSERT INTO accountUsers (UniqueName, Status, ProfilPicture, Banner) VALUES (?, ?, ?, ?);`, NewUser.UniqueName, "member", "../img/profile_pictures/1.png", "../img/banners/1.png")
			addSession(w, r, NewUser.UniqueName)
			http.Redirect(w, r, "/home", http.StatusMovedPermanently)
		}
	}
}

func DeleteUser(cronosDB *sql.DB, uniqueName string) {
	_, err := cronosDB.Exec(`DELETE FROM logUsers WHERE UniqueName = '?';`, uniqueName)
	if err != nil {
		log.Fatal(err)
		// GESTION D'ERREUR RENVOIE DE L'ERREUR
	}
}

func ModifyUser(cronosDB *sql.DB, uniqueName string, User UserLogin) {
	_, err := cronosDB.Exec(`UPDATE logUsers SET UniqueName = '?', Email ='?', Password = '?' WHERE UniqueName = '?';`, User.UniqueName, User.Email, User.Password, uniqueName)
	if err != nil {
		log.Fatal(err)
		// GESTION D'ERREUR RENVOIE DE L'ERREUR
	}
}

func CheckUser(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			uniqueName, email, password string
			User                        UserLogin
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &User)
		sqlStatement := fmt.Sprintf(`SELECT * FROM logUsers WHERE (UniqueName = '%s' OR Email = '%s') AND Password = '%s';`, User.UniqueName, User.Email, User.Password)
		row := cronosDB.QueryRow(sqlStatement)
		if err := row.Scan(&uniqueName, &email, &password); err != nil {
			w.Write([]byte(`{ "ERROR":"404" }`))
		} else {
			addSession(w, r, User.UniqueName)
			http.Redirect(w, r, "/home", http.StatusMovedPermanently)
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

// func leaveSession(w http.ResponseWriter, r *http.Request) {
// 	session, _ := store.Get(r, "AUTH_TOKEN")
// 	session.Values["authenticated"] = false
// 	session.Values["uniqueName"] = ""
// 	session.Save(r, w)
// }

func validSession(w http.ResponseWriter, r *http.Request) bool {
	session, _ := store.Get(r, "AUTH_TOKEN")
	auth, ok := session.Values["authenticated"].(bool)
	return auth || ok
}

type Cron struct {
	ID       string `json:"ID"`
	Creator  string `json:"creator"`
	Content  string `json:"content"`
	TimeLeft struct {
		Year, Month, Day, Hour, Minute int
	} `json:"timeLeft"`
	Tag      string `json:"tag"`
	ParentID int    `json:"ParentID"`
}

// TIME LEFT, CONTENT
func CreateCron(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if validSession(w, r) {
			var (
				Cron = Cron{}
			)
			body, _ := ioutil.ReadAll(r.Body)
			json.Unmarshal(body, &Cron)
			session, _ := store.Get(r, "AUTH_TOKEN")
			Cron.Creator = session.Values["uniqueName"].(string)
			result, _ := cronosDB.Exec(`INSERT INTO cron (Creator, Content, Tag, ParentID) VALUES (?, ?, ?, ?);`, Cron.Creator, Cron.Content, Cron.Tag, Cron.ParentID)
			ID, _ := result.LastInsertId()
			cronosDB.Exec(`INSERT INTO timeLeft (ID, Year, Month, Day, Hour, Minute) VALUES (?, ?, ?, ?, ?, ?);`, ID, Cron.TimeLeft.Year, Cron.TimeLeft.Month, Cron.TimeLeft.Day, Cron.TimeLeft.Hour, Cron.TimeLeft.Minute)
			w.Write([]byte(fmt.Sprintf(`{ "ID" : "%v" }`, ID)))
		} else {
			http.Redirect(w, r, "/", http.StatusMovedPermanently)
		}
	}
}

func DeleteCron(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

// ID
func RedirectCron(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

// ID
func GetCron(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			Cron = Cron{}
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &Cron)
		sqlStatement := fmt.Sprintf(`SELECT * FROM cron WHERE ID = %v`, Cron.ID)
		row := cronosDB.QueryRow(sqlStatement)
		if err := row.Scan(&Cron.ID, &Cron.Creator, &Cron.Content, &Cron.Tag, &Cron.ParentID); err != nil {
			fmt.Println(err)
			w.Write([]byte(`{ "ERROR":"404" }`))
		} else {
			sqlStatement = fmt.Sprintf(`SELECT Year, Month, Day, Hour, Minute FROM timeLeft WHERE ID = %v`, Cron.ID)
			row = cronosDB.QueryRow(sqlStatement)
			row.Scan(&Cron.TimeLeft.Year, &Cron.TimeLeft.Month, &Cron.TimeLeft.Day, &Cron.TimeLeft.Hour, &Cron.TimeLeft.Minute)
			response := fmt.Sprintf(`{
				"ID":"%v",
				"Creator":"%v",
				"Content":"%v",
				"TimeLeft":{
					"Year":"%v",
					"Month":"%v",
					"Day":"%v",
					"Hour":"%v",
					"Minute":"%v"
				},
				"Tag":"%v",
				"ParentID":%v
			}`, Cron.ID, Cron.Creator, Cron.Content, Cron.TimeLeft.Year, Cron.TimeLeft.Month, Cron.TimeLeft.Day, Cron.TimeLeft.Hour, Cron.TimeLeft.Minute, Cron.Tag, Cron.ParentID)
			w.Write([]byte(response))
		}
	}
}

func GoDeleteCron(cronosDB *sql.DB) {
	for {
		date := time.Now()
		fmt.Println(date.Format("2006 01 02 15 04"))
		fmt.Println(date.Format("2006")) // Année
		fmt.Println(date.Format("01"))   // Mois
		fmt.Println(date.Format("02"))   // Jour
		fmt.Println(date.Format("15"))   // Heure
		fmt.Println(date.Format("04"))   // Minute

		time.Sleep(time.Second * 5)
	}
}
