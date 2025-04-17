# AllergieApp

### Database (server) toevoegen aan pgAdmin
1. start de pgAdmin docker container
2. Ga naar de pgAdmin url in de browser en log in.
3. Klik op servers in de Object Explorer.
4. druk in de top bar op "Object" -> "Register" -> "Server…"
5. Vul het formulier in:

**General tab**\
Name: Kies een naam voor de server, bijvoorbeeld AllergieApp of AllergieApp_Server

**Connection tab**\
Host name/address: db (naam van de docker container van de database)\
Port: 5432 (poort van de postgres container)\
Maintenance database: Allergen_db (database naam)\
Username: jouw database username\
Password: jouw database wachtwoord\
Zet het vinkje aan bij "Save password"

6. Klik op "Save"
7. Je kunt de server en database nu vinden onder servers in de Object Explorer.

### Database (server) tabellen bekijken in pgAdmin
Om de tabellen in de database te zien kan je gaan naar: server naam -> "Databases" -> database naam -> "schemas" -> "Tables". 

### Database (server) tabellen data bekijken in pgAdmin
Na bekijken van de tabel in pgadmin kan je: tabel naam -> rechter muisklik -> "view/edit data" -> kies dan 1 van de opties.