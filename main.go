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

	Env.Router.HandleFunc("/connexion", forum.Connexion_Creation())
	Env.Router.HandleFunc("/home", forum.Home())
	Env.Router.HandleFunc("/admin", forum.Moderation())
	Env.Router.HandleFunc("/profil/{nameUser}", forum.Profil())

	Env.Router.HandleFunc("/{username}/cron/{idcron}", forum.CronPage())

	Env.Router.HandleFunc("/cronosdb/POST/logUsers/CHECK", forum.CheckUser(Env.DB))
	Env.Router.HandleFunc("/cronosdb/POST/logUsers/REGISTER", forum.CreateNewUser(Env.DB))

	Env.Router.HandleFunc("/cronosdb/POST/userInfo/GET", forum.GetUser(Env.DB))

	Env.Router.HandleFunc("/cronosdb/POST/cron/CREATE", forum.CreateCron(Env.DB))
	Env.Router.HandleFunc("/cronosdb/POST/cron/REDIRECT", forum.RedirectCron(Env.DB))
	Env.Router.HandleFunc("/cronosdb/POST/cron/GET", forum.GetCron(Env.DB))
	Env.Router.HandleFunc("/cronosdb/POST/cron/DELETE", forum.DeleteCron(Env.DB))
	Env.Router.HandleFunc("/cronosdb/POST/cron/LIKE", forum.CreateLike(Env.DB))

	s := &http.Server{
		Addr:    ":8080",
		Handler: Env.Router,
	}

	// go forum.GoDeleteCron(Env.DB)

	log.Fatal(s.ListenAndServe())
}
