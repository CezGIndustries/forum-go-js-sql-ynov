package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/sessions"
	_ "github.com/mattn/go-sqlite3"
)

type UserLogin struct {
	UniqueName string `json:"uniqueName"`
	Email      string `json:"email"`
	Password   string `json:"password"`
}

func DatabaseInit(folder string) *sql.DB {
	chronosDB, err := sql.Open("sqlite3", folder+"chronosDB.db")
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

	_, err = chronosDB.Exec(logUsers)
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
			User REFERENCES accountUsers(uniqueName),
			FollowUser REFERENCES accountUsers(uniqueName)
		);
	`

	_, err = chronosDB.Exec(accountUsers)
	if err != nil {
		log.Fatal(err)
	}

	cron := `
		CREATE TABLE IF NOT EXISTS cron (
			ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENTE,
			Creator REFERENCES accountUsers(uniqueName),
			Content TEXT(240) NOT NULL,
			Tag TEXT NOT NULL
		);
		CREATE TABLE IF NOT EXISTS timeLeft (
			ID INTEGER REFERENCES cron(id),
			Year INTEGER(2) NOT NULL,
			Month INTEGER(1) NOT NULL,
			Day INTEGER(1) NOT NULL,
			Hour INTEGER(1) NOT NULL,
			Minute INTEGER(1) NOT NULL,
		);
		CREATE TABLE IF NOT EXISTS cronCommentary (
			IDCron INTEGER REFERENCES cron(id),
			ID INTEGER NOT NULL PRIMARY KEY,
			Creator REFERENCES accountUsers(uniqueName),
			Content TEXT(240) NOT NULL
		);
		CREATE TABLE IF NOT EXISTS cronLike (
			ID INTEGER REFERENCES cron(id),
			User REFERENCES accountUsers(uniqueName)
		);
	`

	_, err = chronosDB.Exec(cron)
	if err != nil {
		log.Fatal(err)
	}

	return chronosDB
}

func CreateNewUser(chronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			NewUser UserLogin
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &NewUser)
		_, err := chronosDB.Exec(`INSERT INTO logUsers (UniqueName, Email, Password) VALUES (?, ?, ?);`, NewUser.UniqueName, NewUser.Email, NewUser.Password)
		if err != nil {
			w.Write([]byte(`{ "ERROR":"409" }`))
		} else {
			chronosDB.Exec(`INSERT INTO accountUsers (UniqueName, Status, ProfilPicture, Banner) VALUES (?, ?, ?, ?);`, NewUser.UniqueName, "member", "../img/profile_pictures/1.png", "../img/banners/1.png")
			addSession(w, r, NewUser.UniqueName)
			http.Redirect(w, r, "/home", http.StatusFound)
		}
	}
}

func DeleteUser(chronosDB *sql.DB, uniqueName string) {
	_, err := chronosDB.Exec(`DELETE FROM logUsers WHERE UniqueName = '?';`, uniqueName)
	if err != nil {
		log.Fatal(err)
		// GESTION D'ERREUR RENVOIE DE L'ERREUR
	}
}

func ModifyUser(chronosDB *sql.DB, uniqueName string, User UserLogin) {
	_, err := chronosDB.Exec(`UPDATE logUsers SET UniqueName = '?', Email ='?', Password = '?' WHERE UniqueName = '?';`, User.UniqueName, User.Email, User.Password, uniqueName)
	if err != nil {
		log.Fatal(err)
		// GESTION D'ERREUR RENVOIE DE L'ERREUR
	}
}

func CheckUser(chronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var (
			uniqueName, email, password string
			User                        UserLogin
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &User)
		sqlStatement := fmt.Sprintf(`SELECT * FROM logUsers WHERE (UniqueName = '%s' OR Email = '%s') AND Password = '%s';`, User.UniqueName, User.Email, User.Password)
		row := chronosDB.QueryRow(sqlStatement)
		if err := row.Scan(&uniqueName, &email, &password); err != nil {
			w.Write([]byte(`{ "ERROR":"404" }`))
		} else {
			addSession(w, r, User.UniqueName)
			http.Redirect(w, r, "/home", http.StatusFound)
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

func leaveSession(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "AUTH_TOKEN")
	session.Values["authenticated"] = false
	session.Values["uniqueName"] = ""
	session.Save(r, w)
}

func validSession(w http.ResponseWriter, r *http.Request) bool {
	session, _ := store.Get(r, "AUTH_TOKEN")
	auth := session.Values["authenticated"].(bool)
	return auth
}

type Cron struct {
	Creator  string `json:"creator"`
	Content  string `json:"content"`
	TimeLeft struct {
		Year, Month, Day, Hour, Minute string
	} `json:"timeLeft"`
	Tag string `json:"tag"`
}

// TIME LEFT, CONTENT
func CreateCron(chronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if validSession(w, r) {
			var (
				Cron = Cron{}
			)
			body, _ := ioutil.ReadAll(r.Body)
			json.Unmarshal(body, &Cron)
			session, _ := store.Get(r, "AUTH_TOKEN")
			Cron.Creator = session.Values["uniqueName"].(string)
			chronosDB.Exec(`INSERT INTO cron (Creator, Content, Tag) VALUES (?, ?, ?);`, Cron.Creator, Cron.Content, Cron.Tag)
			chronosDB.Exec(`INSERT INTO timeLeft (Year, Month, Day, Hour, Minute) VALUES (?, ?, ?, ?, ?);`, Cron.TimeLeft.Year, Cron.TimeLeft.Month, Cron.TimeLeft.Day, Cron.TimeLeft.Hour, Cron.TimeLeft.Minute)
			// w.Write
		}
		http.Redirect(w, r, "/", http.StatusForbidden)
	}
}

func GoDeleteCron(chronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

// ID
func RedirectCron(chronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

// ID
func GetCron(chronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}
