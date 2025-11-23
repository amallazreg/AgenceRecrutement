from sentence_transformers import SentenceTransformer, util

# Charger le modèle
model = SentenceTransformer('all-MiniLM-L6-v2')

cv = "Développeur Python avec 2 ans d'expérience en backend"
offre = "Nous cherchons un développeur backend maîtrisant Python"

# Convertir en embeddings
emb_cv = model.encode(cv, convert_to_tensor=True)
emb_offre = model.encode(offre, convert_to_tensor=True)

# Calcul de similarité
similarity = util.cos_sim(emb_cv, emb_offre)

print("Score de similarité :", similarity.item())
