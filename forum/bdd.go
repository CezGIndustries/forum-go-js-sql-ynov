package forum

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

type User struct {
	Id       int
	Name     string
	Image    string
	Email    string
	Password string
	Tag      []string
}

func InitUserBDD(database string) *sql.DB {
	db, err := sql.Open("sqlite3", database)

	if err != nil {
		log.Fatal(err)
	}

	SqltStmt := `
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				email TEXT NOT NULL,
				password TEXT NOT NULL
		);
					`
	_, err = db.Exec(SqltStmt)

	if err != nil {
		log.Fatal(err)
	}
	return db
}
func CreateUser(db *sql.DB, name string, email string, password string) (int64, error) {
	result, _ := db.Exec(`INSERT INTO users (name,email,password) VALUES (?,?,?)`, name, email, password)
	return result.LastInsertId()

}
