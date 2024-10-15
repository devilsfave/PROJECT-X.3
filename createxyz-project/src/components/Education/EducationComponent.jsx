import React from 'react';
import ButtonStyling from '../ButtonStyling';

function EducationComponent() {
  const articles = [
    { id: 1, title: "Understanding Skin Cancer", content: "..." },
    { id: 2, title: "Importance of Regular Skin Checks", content: "..." },
    // Add more educational articles
  ];

  return (
    <section id="education" className="my-8">
      <h2 className="text-xl mb-4 text-[#EFEFED]">Skin Health Education</h2>
      <div className="bg-[#171B26] p-4 rounded-lg">
        {articles.map(article => (
          <div key={article.id} className="mb-4">
            <h3 className="text-lg text-[#EFEFED]">{article.title}</h3>
            <p className="text-[#9C9FA4]">{article.content.substring(0, 100)}...</p>
            <ButtonStyling text="Read More" onClick={() => {/* Implement read more logic */}} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default EducationComponent;