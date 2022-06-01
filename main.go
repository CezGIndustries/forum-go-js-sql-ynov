package main

import (
	"forum/forum"
	"net/http"
	"os"
)

func main() {
	fileServer := http.FileServer(http.Dir("static/"))
	http.Handle("/ressources/", http.StripPrefix("/ressources/", fileServer))

	db := forum.InitUserBDD("users.db")
	defer db.Close()
	forum.CreateUser(db, "Jeremy", "jeremy.dura@ynov.com", "AZEAZE") //func pour crée un user dans la bdd

	http.HandleFunc("/", forum.Connexion_Creation())
	http.HandleFunc("/home", forum.Home())
	http.HandleFunc("/profil", forum.Profil()) //mettre le nom du mec à la place

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.ListenAndServe(":"+port, nil)

}
