from sentence_transformers import SentenceTransformer, util

# Charger le modèle une seule fois (important !)
model = SentenceTransformer('all-MiniLM-L6-v2')

def calculer_similarite(cv_text, offre_text):
    """
    Prend le texte du CV et le texte de l'offre d'emploi
    Retourne un score de similarité entre 0 et 1
    """

    emb_cv = model.encode(cv_text, convert_to_tensor=True)
    emb_offre = model.encode(offre_text, convert_to_tensor=True)

    similarity = util.cos_sim(emb_cv, emb_offre)

    return float(similarity.item())
