package main

import (
	"fmt"
	"forum/forum"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	m := mux.NewRouter()

	m.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	m.HandleFunc("/", forum.Connexion_Creation())
	m.HandleFunc("/home", forum.Home())

	m.HandleFunc("/profil/{nameUser}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		fmt.Print(vars)
		nameUser := vars["nameUser"]
		fmt.Println(nameUser)
	})

	s := &http.Server{
		Addr:    ":8080",
		Handler: m,
	}

	log.Fatal(s.ListenAndServe())
}
