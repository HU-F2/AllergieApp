import {fetchTestMessage} from "../services/testService.js";

export async function navigate(page: string) {
    const content = document.getElementById('content')!;
    if (page === 'home') {
      content.innerHTML = `
        <h1>Wat zijn pollen?</h1>
        <p>Pollen zijn microscopische deeltjes die planten en bomen verspreiden. Ze veroorzaken bij veel mensen hooikoorts.</p>
      `;
    } else if (page === 'advice') {
      content.innerHTML = `
        <h1>Adviezen tegen hooikoorts</h1>
        <ul>
          <li>Blijf binnen bij droog en winderig weer.</li>
          <li>Gebruik een zonnebril buiten om pollen uit je ogen te houden.</li>
          <li>Douche na het buiten zijn om pollen van je huid en haar te verwijderen.</li>
        </ul>
      `;
    } else if (page === 'trees') {
      const result = await fetchTestMessage();
      content.innerHTML = `<h1>${result}</h1>`;
      // try {
      //   const response = await fetch('https://localhost:5001/api/trees');
      //   const trees = await response.json();
      //   content.innerHTML = '<h1>Bomen in jouw omgeving</h1>';
      //   trees.forEach(tree => {
      //     const el = document.createElement('div');
      //     el.innerHTML = `
      //       <h2>${tree.name}</h2>
      //       <p>${tree.description}</p>
      //       <p>Pollenperiode: ${tree.pollenSeason}</p>
      //     `;
      //     content.appendChild(el);
      //   });
      // } catch (error) {
      //   content.innerHTML = `<h1>error bij ophalen bomen: "${error}"</h1>`;
      // }
    }
}