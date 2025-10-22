"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import emailjs from '@emailjs/browser';

// Configuration EmailJS
const EMAILJS_SERVICE_ID = "service_f78zbbp"; // Service ID
const EMAILJS_TEMPLATE_ID = "template_ogh33nd"; // Template ID
const EMAILJS_PUBLIC_KEY = "jRJvDdBkoX-VtQnDt"; // Public Key

// Initialiser EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    age: "",
    sexe: "",
    filiere: "",
    choix: [] as string[],
    choix_autre: "",
    connaissance: [] as string[],
    connaissance_autre: "",
    satisfaction: "",
    commentaire: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
          ? [...(prev[name as keyof typeof formData] as string[]), value]
          : (prev[name as keyof typeof formData] as string[]).filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate PDF
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("FEUILLE DE SONDAGE - EFTG PRO", 10, 10);
      doc.setFontSize(12);
      doc.text(`Âge: ${formData.age || "-"}`, 10, 20);
      doc.text(`Sexe: ${formData.sexe || "-"}`, 10, 30);
      doc.text(`Filière: ${formData.filiere || "-"}`, 10, 40);
      doc.text("Choix de l'école:", 10, 50);
      doc.text(formData.choix.join(", ") || "-", 10, 60);
      doc.text(`Autre choix: ${formData.choix_autre || "-"}`, 10, 70);
      doc.text("Connaissance de l'école:", 10, 80);
      doc.text(formData.connaissance.join(", ") || "-", 10, 90);
      doc.text(`Autre connaissance: ${formData.connaissance_autre || "-"}`, 10, 100);
      doc.text(`Satisfaction: ${formData.satisfaction || "-"}`, 10, 110);
      doc.text(`Commentaires: ${formData.commentaire || "-"}`, 10, 120);

      // Format form data for email
      const formattedData = `
Âge: ${formData.age || "-"}
Sexe: ${formData.sexe || "-"}
Filière: ${formData.filiere || "-"}

Choix de l'école:
${formData.choix.join(", ") || "-"}
Autre choix: ${formData.choix_autre || "-"}

Connaissance de l'école:
${formData.connaissance.join(", ") || "-"}
Autre connaissance: ${formData.connaissance_autre || "-"}

Satisfaction: ${formData.satisfaction || "-"}
Commentaires: ${formData.commentaire || "-"}
      `;

      // Préparer les données pour EmailJS
      const templateParams = {
        from_name: 'Formulaire EFTG Pro',
        to_name: 'Administrateur',
        reply_to: 'noreply@eftgpro.com',
        subject: 'Nouveau formulaire EFTG Pro',
        message: formattedData,
        plain_message: formattedData
      };

      // Envoyer l'email avec EmailJS
      try {
        console.log('Envoi de l\'email avec les paramètres:', templateParams);
        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );
        
        console.log('Réponse EmailJS:', response);
        
        if (response.status === 200) {
          // Sauvegarder également le PDF localement
          doc.save("EFTG_PRO_Sondage.pdf");
          setIsSubmitted(true);
        } else {
          throw new Error(`Erreur EmailJS: ${response.status} ${response.text}`);
        }
      } catch (emailError) {
        console.error('Erreur détaillée EmailJS:', emailError);
        // Even if email fails, still download the PDF
        doc.save("EFTG_PRO_Sondage.pdf");
        alert('Le formulaire a été téléchargé mais une erreur est survenue lors de l\'envoi par email.');
        setIsSubmitted(true);
      } finally {
        setIsSubmitting(false);
      }

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  const choixOptions = [
    "Qualité de la formation",
    "Réputation de l'école",
    "Recommandation",
    "Proximité géographique"
  ];

  const connaissanceOptions = [
    "Réseaux sociaux",
    "Publicité / affiche",
    "Journées portes ouvertes",
    "Par un ami / une connaissance"
  ];

  const satisfactionOptions = [
    "Très satisfait(e)",
    "Satisfait(e)",
    "Peu satisfait(e)",
    "Pas du tout satisfait(e)"
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
            {/* Enlarged EFTG logo */}
            <h1 className=" font-bold text-[#c0a97a]">EFTG</h1>
          {/* Enlarged PRO text */}
          <h3 className=" font-medium text-[#c0a97a] mb-2">PRO</h3>
          <div className="w-32 h-1.5 bg-[#c0a97a] mx-auto mb-8 rounded-full"></div>
          {/* Enlarged title */}
          <p className="text-3xl font-bold text-gray-800">FEUILLE DE SONDAGE - EFTG PRO</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-10">
            {/* Section 1: Informations générales */}
            <div>              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Âge :</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 focus:bg-white focus:outline-none transition-all duration-300 shadow-sm"
                    placeholder="Votre âge"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Sexe :</label>
                  <div className="flex space-x-8">
                    {["Féminin", "Masculin"].map((option) => (
                      <label key={option} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="sexe"
                          value={option}
                          checked={formData.sexe === option}
                          onChange={handleRadioChange}
                          className="h-5 w-5 text-[#c0a97a] focus:ring-0 accent-[#c0a97a]"
                        />
                        <span className="ml-2 text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Spécialité / Filière :</label>
                  <input
                    type="text"
                    name="filiere"
                    value={formData.filiere}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 focus:bg-white focus:outline-none transition-all duration-300 shadow-sm"
                    placeholder="Votre spécialité"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Choix de l'école */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">2. Choix de l'école</h2>
              <label className="block text-gray-700 mb-4">Pourquoi avez-vous choisi l'EFTG Pro ?</label>
              
              <div className="space-y-3">
                {choixOptions.map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      name="choix"
                      value={option}
                      checked={formData.choix.includes(option)}
                      onChange={handleChange}
                      className="h-5 w-5 text-[#c0a97a] rounded focus:ring-0 accent-[#c0a97a]"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
                
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">Autre :</label>
                  <input
                    type="text"
                    name="choix_autre"
                    value={formData.choix_autre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 focus:bg-white focus:outline-none transition-all duration-300 shadow-sm"
                    placeholder="Précisez votre choix"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Connaissance de l'école */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">3. Connaissance de l'école</h2>
              <label className="block text-gray-700 mb-4">Comment avez-vous connu l'EFTG Pro ?</label>
              
              <div className="space-y-3">
                {connaissanceOptions.map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      name="connaissance"
                      value={option}
                      checked={formData.connaissance.includes(option)}
                      onChange={handleChange}
                      className="h-5 w-5 text-[#c0a97a] rounded focus:ring-0 accent-[#c0a97a]"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
                
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">Autre :</label>
                  <input
                    type="text"
                    name="connaissance_autre"
                    value={formData.connaissance_autre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 focus:bg-white focus:outline-none transition-all duration-300 shadow-sm"
                    placeholder="Précisez votre source"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Satisfaction */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">4. Satisfaction</h2>
              <label className="block text-gray-700 mb-4">Êtes-vous satisfait(e) de votre expérience à l'EFTG Pro ?</label>
              
              <div className="space-y-3">
                {satisfactionOptions.map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="satisfaction"
                      value={option}
                      checked={formData.satisfaction === option}
                      onChange={handleRadioChange}
                      className="h-5 w-5 text-[#c0a97a] focus:ring-0 accent-[#c0a97a]"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              
              <div className="mt-6">
                <label className="block text-gray-700 mb-2">Commentaires ou suggestions d'amélioration :</label>
                <textarea
                  name="commentaire"
                  value={formData.commentaire}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 focus:bg-white focus:outline-none transition-all duration-300 shadow-sm rounded-md"
                  placeholder="Vos commentaires..."
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 bg-[#c0a97a] font-medium text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center rounded-md ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement en cours...
                  </>
                ) : (
                  "SUBMIT"
                )}
              </button>
              
              {isSubmitted && (
                <div className="mt-4 p-4 text-[#c0a97a] text-center">
                  Formulaire soumis avec succès ! Le PDF a été téléchargé et envoyé par email.
                </div>
              )}
            </div>
          </form>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} EFTG PRO - Tous droits réservés
        </div>
      </div>
    </div>
  );
}