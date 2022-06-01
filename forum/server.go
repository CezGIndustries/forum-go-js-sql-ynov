package forum

import (
	"fmt"
	"html/template"
	"net/http"
)

func Home() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("./static/home/index.html")
		t.Execute(w, "hello world")
	}
}

func Connexion_Creation() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("./static/connexion-creation/index.html")
		t.Execute(w, "hello world")
	}
}

func Profil() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("./static/profil/index.html")
		t.Execute(w, "hello world")
	}
}

func LogUsers() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("test")
	}
}
