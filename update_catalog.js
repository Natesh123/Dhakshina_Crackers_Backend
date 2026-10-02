const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('../Dhakshina_Crackers_Admin/app/components/ProductCatalog.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Add state variable
if (!content.includes('const [selectedImage, setSelectedImage]')) {
  content = content.replace(
    'const [activeFilter, setActiveFilter] = useState("All");',
    'const [activeFilter, setActiveFilter] = useState("All");\n  const [selectedImage, setSelectedImage] = useState<Product | null>(null);'
  );
}

// 2. Mobile Image Click
content = content.replace(
  '<div className="w-[85px] h-[85px] rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5 overflow-hidden shrink-0 relative">',
  '<div \n                                className="w-[85px] h-[85px] rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5 overflow-hidden shrink-0 relative cursor-pointer"\n                                onClick={() => setSelectedImage(prod)}\n                             >'
);

// 3. Desktop Image Click
content = content.replace(
  '<div className="w-[80px] lg:w-[90px] h-[70px] lg:h-[75px] rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0 group-hover:border-festive-gold/30 transition-all mx-auto">',
  '<div \n                                className="w-[80px] lg:w-[90px] h-[70px] lg:h-[75px] rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0 group-hover:border-festive-gold/30 transition-all mx-auto cursor-pointer"\n                                onClick={() => setSelectedImage(prod)}\n                            >'
);

// 4. Add the Modal before the closing tags
const modalCode = `
      {/* Image Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
        >
            <div 
                className="relative w-full max-w-2xl h-[70vh] bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-festive-red text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md"
                    onClick={() => setSelectedImage(null)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none">
                    <h3 className="text-white font-bold text-xl mb-1">{selectedImage.name}</h3>
                    <p className="text-gray-300 text-sm font-medium">{selectedImage.category}</p>
                </div>
                <div className="relative w-full h-full p-8">
                    <img
                        src={selectedImage.image || "/assets/images/placeholder.png"}
                        alt={selectedImage.name}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        </div>
      )}
    </section>
  );
}
`;

if (!content.includes('{/* Image Modal */}')) {
  content = content.replace(
    '    </section>\n  );\n}\n',
    modalCode
  );
}

fs.writeFileSync(targetFile, content);
console.log('Successfully updated ProductCatalog.tsx');
