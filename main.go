package main

import (
	"fmt"
	"forum/forum"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {

	// db := forum.InitUserBDD("users.db")
	// defer db.Close()
	// forum.CreateUser(db, "Jeremy", "jeremy.dura@ynov.com", "AZEAZE") //func pour crée un user dans la bdd

	r := mux.NewRouter()

	fileServer := http.FileServer(http.Dir("static/"))
	r.Handle("/ressources/", http.StripPrefix("/ressources/", fileServer))

	r.HandleFunc("/", forum.Connexion_Creation())

	r.HandleFunc("/home", forum.Home())

	r.HandleFunc("/profil/{nameUser}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		fmt.Print(vars)
		nameUser := vars["nameUser"]
		fmt.Println(nameUser)
	})

	http.ListenAndServe(":8080", r)

}
