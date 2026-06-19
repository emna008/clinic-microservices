# Clinic Management System — Microservices

> **Cours :** SOA et Microservices  
> **Enseignant :** Dr. Salah Gontara  
> **Année universitaire :** 2025-26

Système de gestion de clinique médicale basé sur une **architecture microservices** avec **gRPC**, **REST**, **GraphQL**, **Kafka** et **Docker**.

---

## Auteur du projet

| Nom | Rôle | GitHub |
|-----|------|--------|
| **Emna Bouharb** | Développement complet (architecture, microservices, API Gateway, Docker, documentation) | _@emna008_ |


---

## Description du projet

Ce projet implémente une plateforme de gestion de clinique composée de **3 microservices métier** et d'une **API Gateway** :

- **Patients** — gestion des fiches patients (SQLite3)
- **Rendez-vous** — planification et suivi des consultations (SQLite3)
- **Dossiers médicaux** — diagnostics, notes et prescriptions (RxDB)
- **API Gateway** — exposition REST + GraphQL, traduction vers gRPC

La communication **asynchrone** entre services est assurée par **Apache Kafka** (événements `patient.registered` et `appointment.created`).

---

## Démarrage rapide

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré
- (Optionnel) Node.js 20 LTS + npm pour exécution locale

### Lancer tout le projet

```bash
git clone https://github.com/VOTRE-USERNAME/clinic-microservices.git
cd clinic-microservices
docker-compose up --build
```

### Vérifier que ça fonctionne

| URL | Description |
|-----|-------------|
| http://localhost:3000 | API Gateway (statut) |
| http://localhost:3000/graphql | GraphQL Playground |
| http://localhost:3000/api/patients | REST — Patients |

---

## Scénario de démonstration (3 étapes)

```bash
# 1. Créer un patient
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Mohamed","lastName":"Ben Ali","dateOfBirth":"1990-05-15","gender":"M","phone":"+216 20 123 456","email":"mohamed@test.com","bloodType":"A+"}'

# 2. Créer un RDV (remplacer PATIENT_ID)
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"patientId":"PATIENT_ID","doctorName":"Dr. Trabelsi","specialty":"Cardiologie","dateTime":"2026-07-01T09:00:00.000Z","reason":"Consultation"}'

# 3. Vérifier le dossier médical auto-créé par Kafka
curl http://localhost:3000/api/records/patient/PATIENT_ID
```

---

## Architecture (aperçu)

```
Client (REST + GraphQL)
    └──► API Gateway :3000
              ├──[gRPC]──► Patients Service       :50051 → SQLite3
              ├──[gRPC]──► Appointments Service   :50052 → SQLite3
              └──[gRPC]──► Medical Records Service :50053 → RxDB

Kafka : patient.registered | appointment.created
```

Schéma détaillé : voir [DOCUMENTATION_TECHNIQUE.md](./DOCUMENTATION_TECHNIQUE.md#2-schéma-darchitecture).

---

## Documentation complète

| Document | Contenu |
|----------|---------|
| [DOCUMENTATION_TECHNIQUE.md](./DOCUMENTATION_TECHNIQUE.md) | Documentation technique complète (livrables 2 à 10) |
| [proto/](./proto/) | Fichiers `.proto` gRPC (livrable 5) |

---

## Structure du projet

```
clinic-microservices/
├── proto/                          # Contrats gRPC (Protobuf)
├── microservice-patients/          # Service Patients + producteur Kafka
├── microservice-appointments/      # Service RDV + producteur/consommateur Kafka
├── microservice-medical-records/   # Service dossiers + consommateur Kafka
├── api-gateway/                    # REST + GraphQL → gRPC
├── docker-compose.yml              # Orchestration Docker
├── README.md                       # Ce fichier
└── DOCUMENTATION_TECHNIQUE.md      # Documentation détaillée
```

---

## Technologies

| Composant | Technologie |
|-----------|-------------|
| Runtime | Node.js 20 |
| Communication inter-services | gRPC + Protocol Buffers (HTTP/2) |
| API publique | REST (Express) + GraphQL |
| Messagerie | Apache Kafka + Zookeeper |
| BDD relationnelles | SQLite3 (better-sqlite3) |
| BDD documents | RxDB (storage memory) |
| Conteneurisation | Docker + Docker Compose |


---

## Licence

Projet académique — A.U. 2025-26.
