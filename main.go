package main

import (
	"forum/forum"
	"net/http"
	"os"
)

func main() {
	fileServer := http.FileServer(http.Dir("./static"))
	http.Handle("/ressources/", http.StripPrefix("/ressources/", fileServer))

	http.HandleFunc("/", forum.Home())
	http.HandleFunc("/home", forum.Home())
	http.HandleFunc("/profil", forum.Home()) //mettre le nom du mec à la place

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	http.ListenAndServe(":"+port, nil)

}
