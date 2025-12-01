function buildCandidateText(candidate) {
  return `
    Skills: ${candidate.skills.join(" ")}

    Experiences: ${candidate.experiences
      .map((exp) =>
        `${exp.position} ${exp.company} ${exp.description || ""}`
      )
      .join(" ")}

    Education: ${candidate.education
      .map((ed) => `${ed.degree} ${ed.institution} ${ed.startYear}-${ed.endYear}`)
      .join(" ")}

    Projects: ${candidate.projects
      .map((p) => `${p.title} ${p.description} ${p.technologies?.join(" ")}`)
      .join(" ")}

    Languages: ${candidate.languages
      .map((l) => `${l.name} ${l.level}`)
      .join(" ")}

    Certifications: ${candidate.certifications
      .map((c) => `${c.title} ${c.issuer}`)
      .join(" ")}
  `;
}

module.exports = { buildCandidateText };
