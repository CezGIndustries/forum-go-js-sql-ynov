package main

import (
	"forum/forum"
	"net/http"
	"os"
)

// const dbFolderName = "chronosDB/"

func main() {
	fileServer := http.FileServer(http.Dir("static/"))
	http.Handle("/ressources/", http.StripPrefix("/ressources/", fileServer))

	// os.Mkdir(dbFolderName, os.ModePerm)
	// forum.DatabasesInit(dbFolderName)

	http.HandleFunc("/", forum.Connexion_Creation())
	http.HandleFunc("/home", forum.Home())
	http.HandleFunc("/profil", forum.Profil())
	http.HandleFunc("/api/v1/database/logusers", forum.LogUsers())

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.ListenAndServe(":"+port, nil)

}
