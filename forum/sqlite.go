package forum

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func DatabasesInit(folder string) {
	databaseLogUser(folder)
}

type UserLogin struct {
	UniqueName string
	Email      string
	Password   string
}

func databaseLogUser(folder string) *sql.DB {
	logUser, err := sql.Open("sqlite3", folder+"logUsers.db")
	if err != nil {
		log.Fatal(err)
	}

	sqlLogUsers := `
		CREATE TABLE IF NOT EXISTS logUsers (
			uniqueName TEXT NOT NULL PRIMARY KEY,
			email TEXT NOT NULL,
			password TEXT NOT NULL
		);
	`

	_, err = logUser.Exec(sqlLogUsers)
	if err != nil {
		log.Fatal(err)
	}

	return logUser
}

func CreateNewUser(chronosDB *sql.DB, NewUser UserLogin) (int64, error) {
	result, err := chronosDB.Exec(`INSERT INTO logUsers (uniqueName, email, password) VALUES (?, ?, ?)`, NewUser.UniqueName, NewUser.Email, NewUser.Password)
	if err != nil {
		log.Fatal(err)
	}
	return result.LastInsertId()
}

// func insertIntoUsers(db *sql.DB, name string, email string, password string) (int64, error);
