import React, { useState } from 'react';

const TermsOfService = () => {
  const [language, setLanguage] = useState('english');

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'filipino' : 'english');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-800">
          {language === 'english' ? 'Terms of Service' : 'Mga Tuntunin ng Serbisyo'}
        </h1>
        <button
          onClick={toggleLanguage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label={language === 'english' ? 'Switch to Filipino' : 'Switch to English'}
        >
          {language === 'english' ? 'Filipino' : 'English'}
        </button>
      </div>
      
      <section className="mb-6 sm:mb-8 bg-green-50 p-4 sm:p-6 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-green-700">
          {language === 'english' ? "1. Let's Get Started!" : "1. Magsimula Tayo!"}
        </h2>
        <p className="text-base sm:text-lg">
          {language === 'english' 
            ? "By joining our vibrant learning community, you're agreeing to these Terms of Service. They're designed to create a positive environment for everyone - students, parents, teachers, and administrators alike. If you have any questions, we're here to help!"
            : "Sa pagsali sa aming masigla na komunidad ng pag-aaral, sumasang-ayon ka sa mga Tuntunin ng Serbisyong ito. Ang mga ito ay dinisenyo upang lumikha ng positibong kapaligiran para sa lahat - mga mag-aaral, magulang, guro, at mga administrator. Kung mayroon kang anumang mga katanungan, nandito kami para tumulong!"}
        </p>
      </section>

      <section className="mb-6 sm:mb-8 bg-blue-50 p-4 sm:p-6 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-blue-700">
          {language === 'english' ? "2. Your Role in Our Community" : "2. Ang Iyong Tungkulin sa Aming Komunidad"}
        </h2>
        <p className="text-base sm:text-lg mb-3 sm:mb-4">
          {language === 'english'
            ? "As a valued member of our LMS, you play a crucial role in maintaining a safe and productive learning environment. Here's how you can contribute:"
            : "Bilang mahalagang miyembro ng aming LMS, mayroon kang mahalagang papel sa pagpapanatili ng ligtas at produktibong kapaligiran ng pag-aaral. Narito kung paano ka makakatulong:"}
        </p>
        <ul className="list-none pl-4 sm:pl-6 mt-2 space-y-2 sm:space-y-3">
          <li className="flex items-center">
            <span className="text-blue-500 mr-2">🔐</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Keep your account information secret - it's your digital identity!"
                : "Panatilihing lihim ang iyong impormasyon sa account - ito ang iyong digital na pagkakakilanlan!"}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-blue-500 mr-2">🖥️</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Always log out when you're done, especially on shared devices."
                : "Palaging mag-log out kapag tapos ka na, lalo na sa mga nakabahaging device."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-blue-500 mr-2">🚨</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "If something seems off with your account, let us know right away."
                : "Kung may kakaiba sa iyong account, ipaalam agad sa amin."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-blue-500 mr-2">✅</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Keep your information up-to-date and accurate."
                : "Panatilihing napapanahon at tumpak ang iyong impormasyon."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-blue-500 mr-2">⚖️</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Follow all applicable laws and regulations while using the LMS."
                : "Sundin ang lahat ng naaangkop na batas at regulasyon habang ginagamit ang LMS."}
            </span>
          </li>
        </ul>
      </section>

      <section className="mb-6 sm:mb-8 bg-purple-50 p-4 sm:p-6 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-purple-700">
          {language === 'english' ? "3. Our Special Education Identification Tool" : "3. Ang Aming Kasangkapan sa Pagtukoy ng Espesyal na Edukasyon"}
        </h2>
        <p className="text-base sm:text-lg mb-3 sm:mb-4">
          {language === 'english'
            ? "We're proud to offer a tool that helps identify students who might benefit from extra support. Here's what you need to know:"
            : "Ipinagmamalaki namin ang pag-aalok ng isang kasangkapan na tumutulong sa pagtukoy ng mga mag-aaral na maaaring makinabang sa karagdagang suporta. Narito ang kailangan mong malaman:"}
        </p>
        <ul className="list-none pl-4 sm:pl-6 mt-2 space-y-2 sm:space-y-3">
          <li className="flex items-center">
            <span className="text-purple-500 mr-2">🎯</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "It's designed to spot potential needs early on."
                : "Ito ay dinisenyo upang matukoy ang mga potensyal na pangangailangan nang maaga."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-purple-500 mr-2">🔬</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "It's not a diagnosis - think of it as a helpful hint for further exploration."
                : "Hindi ito isang diagnosis - isipin ito bilang isang kapaki-pakinabang na pahiwatig para sa karagdagang pagsisiyasat."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-purple-500 mr-2">🔒</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Only authorized staff can use it, and all data is kept confidential."
                : "Tanging ang mga awtorisadong kawani lamang ang maaaring gumamit nito, at lahat ng datos ay pinapanatiling kumpidensyal."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-purple-500 mr-2">👪</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Parents are always involved in any decisions about their child's education."
                : "Ang mga magulang ay palaging kasali sa anumang desisyon tungkol sa edukasyon ng kanilang anak."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-purple-500 mr-2">📈</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "We're constantly improving it based on the latest research."
                : "Patuloy naming pinapabuti ito batay sa pinakabagong pananaliksik."}
            </span>
          </li>
        </ul>
      </section>

      <section className="mb-6 sm:mb-8 bg-yellow-50 p-4 sm:p-6 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-yellow-700">
          {language === 'english' ? "4. Respect and Kindness" : "4. Paggalang at Kabaitan"}
        </h2>
        <p className="text-base sm:text-lg mb-3 sm:mb-4">
          {language === 'english'
            ? "Our LMS is a place for learning and growth. To ensure everyone has a positive experience:"
            : "Ang aming LMS ay isang lugar para sa pag-aaral at paglago. Upang matiyak na lahat ay may positibong karanasan:"}
        </p>
        <ul className="list-none pl-4 sm:pl-6 mt-2 space-y-2 sm:space-y-3">
          <li className="flex items-center">
            <span className="text-yellow-500 mr-2">🤝</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Treat others with respect and kindness, just as you would in person."
                : "Tratuhin ang iba nang may paggalang at kabaitan, tulad ng gagawin mo nang personal."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-yellow-500 mr-2">🚫</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Bullying, harassment, or any form of discrimination is not tolerated."
                : "Hindi pinapayagan ang pang-aapi, panliligalig, o anumang uri ng diskriminasyon."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-yellow-500 mr-2">💬</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Use appropriate language and keep discussions relevant to learning."
                : "Gumamit ng angkop na wika at panatilihing nauugnay sa pag-aaral ang mga talakayan."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-yellow-500 mr-2">🤔</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Be open-minded and considerate of different viewpoints and experiences."
                : "Maging bukas ang isipan at maunawain sa iba't ibang pananaw at karanasan."}
            </span>
          </li>
        </ul>
      </section>

      <section className="mb-6 sm:mb-8 bg-red-50 p-4 sm:p-6 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-red-700">
          {language === 'english' ? "5. Content and Copyright" : "5. Nilalaman at Karapatang-ari"}
        </h2>
        <p className="text-base sm:text-lg mb-3 sm:mb-4">
          {language === 'english'
            ? "Respecting intellectual property is crucial in our digital learning environment:"
            : "Ang paggalang sa intelektwal na ari-arian ay mahalaga sa ating digital na kapaligiran ng pag-aaral:"}
        </p>
        <ul className="list-none pl-4 sm:pl-6 mt-2 space-y-2 sm:space-y-3">
          <li className="flex items-center">
            <span className="text-red-500 mr-2">📚</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Don't share copyrighted materials without permission."
                : "Huwag magbahagi ng mga materyal na may karapatang-ari nang walang pahintulot."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-red-500 mr-2">✍️</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Always give credit to the original creators when using others' work."
                : "Palaging bigyan ng kredito ang mga orihinal na lumikha kapag gumagamit ng gawa ng iba."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-red-500 mr-2">🎨</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Your original work remains yours, but you grant us a license to use it within the LMS."
                : "Ang iyong orihinal na gawa ay nananatiling sa iyo, ngunit binibigyan mo kami ng lisensya na gamitin ito sa loob ng LMS."}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-red-500 mr-2">🚫</span>
            <span className="text-sm sm:text-base">
              {language === 'english'
                ? "Posting inappropriate or offensive content is prohibited."
                : "Ipinagbabawal ang pag-post ng hindi angkop o nakakasakit na nilalaman."}
            </span>
          </li>
        </ul>
      </section>

      <p className="mt-6 sm:mt-8 text-base sm:text-lg text-gray-600 text-center">
        {language === 'english'
          ? "Last updated: October 2024 - We're always improving!"
          : "Huling na-update: Oktubre 2024 - Palagi kaming nagpapabuti!"}
      </p>
    </div>
  );
};

export default TermsOfService;
