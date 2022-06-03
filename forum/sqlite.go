package forum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

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

	return chronosDB
}

func CreateNewUser(chronosDB *sql.DB, NewUser UserLogin) {
	_, err := chronosDB.Exec(`INSERT INTO logUsers (uniqueName, email, password) VALUES (?, ?, ?);`, NewUser.UniqueName, NewUser.Email, NewUser.Password)
	if err != nil {
		log.Fatal(err)
		// GESTION D'ERREUR RENVOIE DE L'ERREUR
	}
}

func DeleteUser(chronosDB *sql.DB, uniqueName string) {
	_, err := chronosDB.Exec(`DELETE FROM logUsers WHERE uniqueName = '?';`, uniqueName)
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
			uniqueName, email, password, response string
			User                                  UserLogin
		)
		body, _ := ioutil.ReadAll(r.Body)
		json.Unmarshal(body, &User)
		sqlStatement := fmt.Sprintf(`SELECT * FROM logUsers WHERE (uniqueName = '%s' OR email = '%s') AND password = '%s';`, User.UniqueName, User.Email, User.Password)
		row := chronosDB.QueryRow(sqlStatement)
		if err := row.Scan(&uniqueName, &email, &password); err != nil { // RENVOIER { "AUTH_TOKEN": "123456789" } ou { "ERROR": "404" }
			response = `{ "ERROR":"404" }`
		} else {
			response = fmt.Sprintf(`{ "AUTH_TOKEN": "%s" }`, "FAIRE LE TOKEN_AUTH") // CREER LE TOKEN AUTH
		}
		w.Write([]byte(response))
	}
}
