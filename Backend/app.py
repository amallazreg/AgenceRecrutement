from flask import Flask, request, jsonify
from AI.matcher import calculer_similarite
from PyPDF2 import PdfReader

app = Flask(__name__)

def offer_to_text(offer):
    """
    Transforme une offre (objet JSON) en un texte structuré
    utile pour SBERT.
    """
    fields = []

    # Champs généraux
    fields.append(f"Titre du poste: {offer.get('title', '')}")
    fields.append(f"Description: {offer.get('description', '')}")
    fields.append(f"Niveau d'expérience: {offer.get('experienceLevel', '')}")
    fields.append(f"Type de contrat: {offer.get('contractType', '')}")
    fields.append(f"Lieu: {offer.get('location', '')}")
    fields.append(f"Horaire: {offer.get('workingHours', '')}")
    fields.append(f"Télétravail: {offer.get('remoteOption', '')}")

    # Compétences techniques
    def list_to_str(name):
        values = offer.get(name, [])
        if values:
            return f"{name}: {', '.join(values)}"
        return ""

    fields.append(list_to_str("programmingLanguages"))
    fields.append(list_to_str("frameworks"))
    fields.append(list_to_str("databaseKnowledge"))
    fields.append(list_to_str("tools"))
    fields.append(list_to_str("methodology"))
    fields.append(list_to_str("marketingChannels"))
    fields.append(list_to_str("financialTools"))
    fields.append(list_to_str("requiredDiploma"))
    fields.append(list_to_str("medicalSpecialty"))
    fields.append(list_to_str("teachingLevel"))
    fields.append(list_to_str("salesType"))

    # Convertir tout en un seul texte
    return "\n".join([f for f in fields if f.strip() != ""])


@app.post("/match")
def match_cv_offer():

    # 1. Vérifier fichier PDF
    if "cv" not in request.files:
        return jsonify({"error": "Veuillez fournir un fichier PDF dans le champ 'cv'"}), 400

    file = request.files["cv"]

    # Extraire texte du PDF
    try:
        pdf = PdfReader(file)
        cv_text = ""
        for page in pdf.pages:
            cv_text += page.extract_text() or ""
    except:
        return jsonify({"error": "Impossible de lire le PDF"}), 500

    # 2. Récupérer l'offre JSON
    try:
        offer_json = request.form.get("offer")
        if not offer_json:
            return jsonify({"error": "Veuillez envoyer le champ 'offer' (JSON)"}), 400

        import json
        offer_obj = json.loads(offer_json)
    except:
        return jsonify({"error": "Format JSON de l'offre invalide"}), 400

    # 3. Transformer l’offre en texte
    offer_text = offer_to_text(offer_obj)

    # 4. Similarité
    score = calculer_similarite(cv_text, offer_text)

    return jsonify({
        "similarite": score,
        "cv_length": len(cv_text),
        "offer_text": offer_text  # optionnel mais utile pour debug
    })

if __name__ == "__main__":
    app.run(debug=True)
