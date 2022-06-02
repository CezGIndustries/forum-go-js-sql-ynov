package main

import (
	"database/sql"
	"forum/forum"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type App struct {
	Router *mux.Router
	DB     *sql.DB
}

func main() {
	Env := App{
		Router: mux.NewRouter(),
		DB:     forum.DatabaseInit("forum/"),
	}

	Env.Router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	Env.Router.HandleFunc("/", forum.Connexion_Creation())
	Env.Router.HandleFunc("/home", forum.Home())

	Env.Router.HandleFunc("/profil/{nameUser}", forum.Profil())

	Env.Router.HandleFunc("/chronosdb/POST/logUsers", forum.InitUser())

	// forum.CreateNewUser(Env.DB, forum.UserLogin{"azeaze", "CezGain@cez.gain", "azerty"})
	// forum.CreateNewUser(Env.DB, forum.UserLogin{"aze", "CezGain@cez.gain", "azerty"})
	// forum.CreateNewUser(Env.DB, forum.UserLogin{"CezGain", "CezGain@cez.gain", "azerty"})

	// forum.CheckUser(Env.DB, forum.UserLogin{"CezGain", "CezGain@cez.gain", "azerty"})

	Env.Router.HandleFunc("/test", forum.Test())

	s := &http.Server{
		Addr:    ":8080",
		Handler: Env.Router,
	}

	log.Fatal(s.ListenAndServe())
}
