package forum

import (
	"fmt"
	"html/template"
	"net/http"

	"github.com/gorilla/mux"
)

func Home() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("./static/home/index.html", "./static/templates/left/leftTemplate.html", "./static/templates/right/rightTemplate.html")
		t.Execute(w, "index.html")
	}
}

// tmpl, _ := template.ParseFiles("./index.html")
// 	tmpl.Execute(w, nil)

func Connexion_Creation() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !ValidSession(w, r) {
			t, _ := template.ParseFiles("./static/connexion-creation/index.html")
			t.Execute(w, "hello world")
		} else {
			http.Redirect(w, r, "/home", http.StatusFound)
		}
	}
}

func Moderation() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("./static/admin/index.html")
		t.Execute(w, "index.html")
	}
}
func Profil() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("./static/profil/index.html", "./static/templates/left/leftTemplate.html", "./static/templates/right/rightTemplate.html")
		t.Execute(w, "index.html")
		username := mux.Vars(r)["nameUser"]
		fmt.Println(username)
	}
}
func CronPage() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("./static/cron/index.html", "./static/templates/left/leftTemplate.html", "./static/templates/right/rightTemplate.html")
		t.Execute(w, "index.html")
		username := mux.Vars(r)["username"]
		id := mux.Vars(r)["idcron"]

		fmt.Println(username, id)
	}
}
