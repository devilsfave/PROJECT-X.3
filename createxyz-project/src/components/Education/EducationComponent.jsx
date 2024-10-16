import React, { useState } from 'react';
import ButtonStyling from '../ButtonStyling';
import Link from 'next/link';

// Educational content for the diseases in HAM10000
const educationContent = [
  {
    title: "Melanoma",
    content: "Learn about melanoma, a serious form of skin cancer that develops from melanocytes.",
    link: "https://www.cancer.org/cancer/melanoma-skin-cancer.html"
  },
  {
    title: "Basal Cell Carcinoma",
    content: "Basal cell carcinoma is the most common form of skin cancer, often appearing as a slightly transparent bump on the skin.",
    link: "https://www.aad.org/public/diseases/skin-cancer/types/basal-cell-carcinoma"
  },
  {
    title: "Squamous Cell Carcinoma",
    content: "Squamous cell carcinoma is a common skin cancer that arises from the squamous cells in the outer layer of the skin.",
    link: "https://www.cancer.org/cancer/squamous-cell-skin-cancer.html"
  },
  {
    title: "Actinic Keratosis",
    content: "Actinic keratosis is a pre-cancerous skin condition caused by sun exposure, appearing as rough, scaly patches.",
    link: "https://www.aad.org/public/diseases/skin-cancer/types/actinic-keratosis"
  },
  {
    title: "Atypical Melanocytic Nevi",
    content: "Atypical nevi are moles that may have irregular features and can be a risk factor for melanoma.",
    link: "https://www.mayoclinic.org/diseases-conditions/atypical-moles/symptoms-causes/syc-20377086"
  },
  {
    title: "Vascular Lesions",
    content: "Vascular lesions include a variety of skin conditions that involve blood vessels, such as hemangiomas and port-wine stains.",
    link: "https://www.ncbi.nlm.nih.gov/books/NBK547990/"
  },
  {
    title: "Dermatofibroma",
    content: "Dermatofibroma is a benign skin growth that often appears as a small, firm bump on the skin.",
    link: "https://www.aad.org/public/diseases/skin-conditions/dermatofibroma"
  },
];

function EducationComponent() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContent = educationContent.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="education" className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-[#EFEFED]">Educational Resources</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 bg-[#262A36] text-[#EFEFED] rounded"
      />
      <div className="bg-[#171B26] p-4 rounded-lg">
        {filteredContent.map(item => (
          <div key={item.title} className="mb-4 p-4 bg-[#262A36] rounded">
            <h3 className="text-lg font-semibold text-[#EFEFED]">{item.title}</h3>
            <p className="text-[#9C9FA4] mb-2">{item.content.substring(0, 100)}...</p>
            <ButtonStyling 
              text="Read More" 
              onClick={() => window.open(item.link, '_blank')}
            />
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-4">
        <Link href="/terms-of-service">
          <a className="block text-center text-[#3B82F6] underline">Terms of Service</a>
        </Link>
        <Link href="/privacy-policy">
          <a className="block text-center text-[#3B82F6] underline">Privacy Policy</a>
        </Link>
      </div>
    </section>
  );
}

export default EducationComponent;