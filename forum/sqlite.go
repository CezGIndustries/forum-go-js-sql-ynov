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
			uniqueName TEXT(32) NOT NULL PRIMARY KEY,
			email TEXT(256) NOT NULL,
			password TEXT(64) NOT NULL
		);
	`

	_, err = chronosDB.Exec(logUsers)
	if err != nil {
		log.Fatal(err)
	}

	accountUsers := `
		CREATE TABLE IF NOT EXISTS accountUsers (
			uniqueName TEXT(32) NOT NULL PRIMARY KEY,
			status TEXT(16) NOT NULL,
			profilPicture TEXT NOT NULL,
			banner TEXT NOT NULL,
			biography TEXT(240)
		);
		CREATE TABLE IF NOT EXISTS follow (
			user REFERENCES accountUsers(uniqueName),
			followUser REFERENCES accountUsers(uniqueName)
		);
	`

	_, err = chronosDB.Exec(accountUsers)
	if err != nil {
		log.Fatal(err)
	}

	cron := `
		CREATE TABLE IF NOT EXISTS cron (
			id INTEGER NOT NULL PRIMARY KEY,
			creator REFERENCES accountUsers(uniqueName),
			content TEXT(240) NOT NULL,
			timeLeft TEXT(64) NOT NULL
		);
		CREATE TABLE IF NOT EXISTS cronCommentary (
			idCron INTEGER REFERENCES cron(id),
			id INTEGER NOT NULL PRIMARY KEY,
			creator REFERENCES accountUsers(uniqueName),
			content TEXT(240) NOT NULL
		);
		CREATE TABLE IF NOT EXISTS cronLike (
			id INTEGER REFERENCES cron(id),
			user REFERENCES accountUsers(uniqueName)
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
		_, err := chronosDB.Exec(`INSERT INTO logUsers (uniqueName, email, password) VALUES (?, ?, ?);`, NewUser.UniqueName, NewUser.Email, NewUser.Password)
		if err != nil {
			w.Write([]byte(`{ "ERROR":"409" }`))
		} else {
			chronosDB.Exec(`INSERT INTO accountUsers (uniqueName, status, profilPicture, banner) VALUES (?, ?, ?, ?);`, NewUser.UniqueName, "member", "../img/profile_pictures/1.png", "../img/banners/1.png")
			addSession(w, r, NewUser.UniqueName)
			http.Redirect(w, r, "/home", http.StatusFound)
		}
	}
}

func DeleteUser(chronosDB *sql.DB, uniqueName string) {
	_, err := chronosDB.Exec(`DELETE FROM logUsers WHERE uniqueName = '?';`, uniqueName)
	if err != nil {
		log.Fatal(err)
		// GESTION D'ERREUR RENVOIE DE L'ERREUR
	}
	_, err = chronosDB.Exec(`DELETE FROM accountUsers WHERE uniqueName = '?';`, uniqueName)
	if err != nil {
		log.Fatal(err)
		// GESTION D'ERREUR RENVOIE DE L'ERREUR
	}
	_, err = chronosDB.Exec(`DELETE FROM follow WHERE user = '?' || followUser = '?';`, uniqueName, uniqueName)
	if err != nil {
		log.Fatal(err)
		// GESTION D'ERREUR RENVOIE DE L'ERREUR
	}
	_, err = chronosDB.Exec(`DELETE FROM cron WHERE creator = '?';`, uniqueName)
	if err != nil {
		log.Fatal(err)
		// GESTION D'ERREUR RENVOIE DE L'ERREUR
	}
	_, err = chronosDB.Exec(`DELETE FROM cronCommentary WHERE creator = '?';`, uniqueName, uniqueName)
	if err != nil {
		log.Fatal(err)
		// GESTION D'ERREUR RENVOIE DE L'ERREUR
	}
	_, err = chronosDB.Exec(`DELETE FROM cronLike WHERE user = '?';`, uniqueName, uniqueName)
	if err != nil {
		log.Fatal(err)
		// GESTION D'ERREUR RENVOIE DE L'ERREUR
	}
}

func ModifyUser(chronosDB *sql.DB, uniqueName string, User UserLogin) {
	_, err := chronosDB.Exec(`UPDATE logUsers SET uniqueName = '?', email ='?', password = '?' WHERE uniqueName = '?';`, User.UniqueName, User.Email, User.Password, uniqueName)
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
		sqlStatement := fmt.Sprintf(`SELECT * FROM logUsers WHERE (uniqueName = '%s' OR email = '%s') AND password = '%s';`, User.UniqueName, User.Email, User.Password)
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
