package main

import (
	"forum/forum"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// func main() {
// fileServer := http.FileServer(http.Dir("static/"))
// http.Handle("/ressources/", http.StripPrefix("/ressources/", fileServer))

// db := forum.InitUserBDD("users.db")
// defer db.Close()
// forum.CreateUser(db, "Jeremy", "jeremy.dura@ynov.com", "AZEAZE") //func pour crée un user dans la bdd

// http.HandleFunc("/", forum.Connexion_Creation())
// http.HandleFunc("/home", forum.Home())
// http.HandleFunc("/profil", forum.Profil()) //mettre le nom du mec à la place

// port := os.Getenv("PORT")
// if port == "" {
// 	port = "8080"
// }

// http.ListenAndServe(":"+port, nil)

// }

func main() {
	m := mux.NewRouter()

	spa := spaHandler{staticPath: "./", indexPath: "index.html"}
	router.PathPrefix("/").Handler(spa)

	m.HandleFunc("/", forum.Connexion_Creation())
	m.HandleFunc("/home", forum.Home())
	m.HandleFunc("/profil/{id}", forum.Profil())

	s := &http.Server{
		Addr:    ":8080",
		Handler: m,
	}

	log.Fatal(s.ListenAndServe())
}
