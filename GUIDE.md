# Guide pratique — Tests Postman et GraphQL

> Pour la documentation officielle (livrables), voir [DOCUMENTATION_TECHNIQUE.md](./DOCUMENTATION_TECHNIQUE.md).

## Démarrer le projet

```powershell
docker-compose up --build
```

Attendre que `clinic-kafka` soit **healthy** avant de tester Kafka.

---

## Tests Postman — ordre recommandé

**Base URL :** `http://localhost:3000`

| # | Méthode | URL | Action |
|---|---------|-----|--------|
| 1 | GET | `/` | Vérifier API |
| 2 | POST | `/api/patients` | Créer patient → copier `id` |
| 3 | GET | `/api/patients` | Lister patients |
| 4 | POST | `/api/appointments` | Créer RDV → copier `id` |
| 5 | GET | `/api/records/patient/{id}` | Dossier auto-créé par Kafka |
| 6 | PATCH | `/api/records/{recordId}/diagnosis` | Modifier diagnostic |
| 7 | PATCH | `/api/records/{recordId}/prescription` | Ajouter prescription |

---

## GraphQL

URL : **http://localhost:3000/graphql**

```graphql
query {
  patientFullProfile(patientId: "VOTRE_ID") {
    patient { firstName lastName }
    appointments { doctorName status }
    records { diagnosis prescriptions }
  }
}
```

---

## Voir les bases de données

| Base | Comment |
|------|---------|
| Patients / RDV | Via API REST ou DB Browser for SQLite |
| Dossiers médicaux | Via API uniquement (RxDB en mémoire) |

```powershell
docker cp clinic-patients:/app/microservice-patients/patients.db ./patients.db
```

---

## Problème : dossiers vides après RDV

1. Vérifier `docker ps` → `clinic-kafka` doit être **Up (healthy)**
2. Recréer un **nouveau** RDV (les anciens n'ont pas déclenché Kafka si celui-ci était down)
3. Attendre 5 secondes puis `GET /api/records/patient/{id}`
