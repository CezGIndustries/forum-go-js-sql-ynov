package main

import (
	"database/sql"
	"forum/forum"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
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

	Env.Router.HandleFunc("/", forum.RedirectCo())
	Env.Router.HandleFunc("/connexion", forum.Connexion_Creation())
	Env.Router.HandleFunc("/home", forum.Home())
	Env.Router.HandleFunc("/admin", forum.Moderation())
	Env.Router.HandleFunc("/explore", forum.Explore())
	Env.Router.HandleFunc("/compose/cron", forum.Compose())
	Env.Router.HandleFunc("/contact", forum.Contact())

	Env.Router.HandleFunc("/profil/{nameUser}", forum.Profil())

	Env.Router.HandleFunc("/{username}/cron/{idcron}", forum.CronPage())

	Env.Router.HandleFunc("/cronosdb/POST/logUsers/CHECK", forum.CheckUser(Env.DB)).Methods("POST")
	Env.Router.HandleFunc("/cronosdb/POST/logUsers/DISCONNECT", forum.LeaveSession()).Methods("POST")
	Env.Router.HandleFunc("/cronosdb/POST/logUsers/REGISTER", forum.CreateNewUser(Env.DB)).Methods("POST")
	Env.Router.HandleFunc("/cronosdb/POST/logUsers/GOOGLE_REGISTER", forum.GoogleLog(Env.DB)).Methods("POST")

	Env.Router.HandleFunc("/cronosdb/POST/getAllUsers/GET", forum.GetAllUsers(Env.DB)).Methods("POST")

	Env.Router.HandleFunc("/cronosdb/POST/adminAccess/CHECK", forum.AdminAccess(Env.DB)).Methods("POST")

	Env.Router.HandleFunc("/cronosdb/POST/userInfo/GET", forum.GetUser(Env.DB)).Methods("POST")
	Env.Router.HandleFunc("/cronosdb/POST/userInfo/PPBIO", forum.ModifyPPBio(Env.DB)).Methods("POST")

	Env.Router.HandleFunc("/cronosdb/POST/cron/CREATE", forum.CreateCron(Env.DB)).Methods("POST")
	Env.Router.HandleFunc("/cronosdb/POST/cron/REDIRECT", forum.RedirectCron(Env.DB)).Methods("POST")
	Env.Router.HandleFunc("/cronosdb/POST/cron/GET", forum.GetCron(Env.DB)).Methods("POST")
	Env.Router.HandleFunc("/cronosdb/POST/cron/MULTIPLE", forum.GetMutlipleCronID(Env.DB)).Methods("POST")
	Env.Router.HandleFunc("/cronosdb/POST/cron/DELETE", forum.DeleteCron(Env.DB)).Methods("POST")
	Env.Router.HandleFunc("/cronosdb/POST/cron/LIKE", forum.CreateLike(Env.DB)).Methods("POST")

	Env.Router.HandleFunc("/cronosdb/POST/contact/REQUEST", temp(Env.DB)).Methods("POST")

	Env.Router.HandleFunc("/cronosdb/POST/profil/CRON_USER", forum.CronUser(Env.DB)).Methods("POST")
	Env.Router.HandleFunc("/cronosdb/POST/profil/CRON_FRIENDS", forum.FriendCronUser(Env.DB)).Methods("POST")

	credentials := handlers.AllowCredentials()
	origins := handlers.AllowedOrigins([]string{"http://localhost"})

	go forum.GoDeleteCron(Env.DB)

	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(credentials, origins)(Env.Router)))
}

func temp(cronosDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}
