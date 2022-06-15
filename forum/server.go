package forum

import (
	"fmt"
	"html/template"
	"net/http"

	"github.com/gorilla/mux"
)

func Home() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
<<<<<<< HEAD
		t := template.Must(template.ParseGlob("./static/home/*.html"))
		t.Execute(w, "hello world")
=======
		t, _ := template.ParseFiles("./static/home/index.html", "./static/templates/left/leftTemplate.html", "./static/templates/right/rightTemplate.html")
		t.Execute(w, "index.html")
>>>>>>> aa678264931127a9218a9096cf4d91a873606309
	}
}

// tmpl, _ := template.ParseFiles("./index.html")
// 	tmpl.Execute(w, nil)

func Connexion_Creation() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !ValidSession(w, r) {
			t, _ := template.ParseFiles("./static/connexion-creation/index.html")
			t.Execute(w, "hello world")
		}
		//  else {
		// w.Header().Set("content-type", "text/html; charset=utf-8")
		// http.Redirect(w, r, "/home", http.StatusMovedPermanently)
		// }
	}
}

func Profil() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("./static/profil/index.html", "./static/templates/left/leftTemplate.html", "./static/templates/right/rightTemplate.html")
		t.Execute(w, "hello world")
		username := mux.Vars(r)["nameUser"]
		fmt.Println(username)
	}
}
