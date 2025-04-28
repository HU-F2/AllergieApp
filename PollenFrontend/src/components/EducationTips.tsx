import { useRef } from 'react';

const EducationTips = () => {
    const pollenRef = useRef<HTMLElement>(null);
    const symptomsRef = useRef<HTMLElement>(null);

    const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const pollenSectionTitle = 'Wat zijn pollen?';
    const symptomsSectionTitle = 'Hoe ontstaan klachten?';

    return (
        <div className="education-tips">
            <section className="education-section">
                <h2>Wat is hooikoorts?</h2>
                <p>
                    Hooikoorts, ook wel allergische rhinitis genoemd, is een overgevoeligheidsreactie van het immuunsysteem 
                    op <b><span onClick={() => scrollToSection(pollenRef)} title={pollenSectionTitle} className="inline-link">pollen</span></b>. 
                    Bij mensen met hooikoorts herkent het lichaam pollen onterecht als schadelijke indringers, 
                    wat leidt tot een allergische reactie. Dit veroorzaakt <b><span onClick={() => scrollToSection(symptomsRef)} title={symptomsSectionTitle} className="inline-link">symptomen </span></b>
                    zoals niezen, jeuk, tranende ogen en ademhalingsproblemen. 
                    Hooikoorts kan de levenskwaliteit beïnvloeden, vooral tijdens droge, 
                    zonnige en winderige dagen wanneer veel pollen in de lucht zijn.
                </p>
            </section>

            <section className="education-section" ref={pollenRef}>
                <h2>{pollenSectionTitle}</h2>
                <p>
                    Pollen zijn microscopisch kleine stuifmeelkorrels afkomstig van bomen, grassen en planten. 
                    Ze worden door de wind verspreid om planten te laten voortplanten. Tijdens het pollenseizoen 
                    kunnen er hoge concentraties pollen in de lucht voorkomen, wat bij sommige mensen allergische 
                    reacties en hooikoorts veroorzaakt.
                </p>
                <h3>Pollen seizoenen</h3>
                <ul>
                    <li>Hooikoorts door <b>bomen</b> begint meestal in februari of maart. De meeste klachten treden op tussen maart en eind mei.</li>
                    <li>Hooikoorts door <b>gras</b> begint vaak in april of mei. De meeste klachten zijn dan tussen mei en augustus.</li>
                </ul>
            </section>

            <section className="education-section" ref={symptomsRef}>
                <h2>{symptomsSectionTitle}</h2>
                <p>
                    Wanneer je pollen inademt of ze in contact komen met je ogen of huid, reageert het immuunsysteem 
                    overdreven. Er worden stoffen zoals histamine vrijgegeven, die de typische hooikoortsklachten veroorzaken. 
                    Daarnaast kunnen de klachten ontstaan als pollen in je ogen, neus, mond, keel of luchtpijp komt. 
                    Hierdoor worden de slijmvliezen dikker en maken ze meer slijm aan.
                    De ernst van klachten hangt vaak af van de hoeveelheid pollen in de lucht en de gevoeligheid van de persoon.
                </p>
                <h3>Mogelijke klachten:</h3>
                <ul>                    
                    <li>Niezen</li>
                    <li>Loopneus of verstopte neus</li>
                    <li>Jeukende, rode of tranende ogen</li>
                    <li>Benauwdheid of piepende ademhaling</li>
                    <li>Jeuk in keel, neus of oren</li>
                    <li>Vermoeidheid en concentratieproblemen</li>
                </ul>
            </section>

            <section className="education-section">
                <h2>Tips voor omgaan met hooikoorts</h2>
                <ul>
                    <li>Houd ramen gesloten op droge, winderige dagen, vooral in de ochtend en avond.</li>
                    <li>Draag een zonnebril buiten om te voorkomen dat pollen in je ogen komen.</li>
                    <li>Douche en was je haar na buitenshuis zijn om pollen te verwijderen.</li>
                    <li>Gebruik een pollenfilter in je auto en airco.</li>
                    <li>Volg het dagelijkse hooikoortsbericht om risico’s te beperken.</li>
                    <li>Vermijd grasvelden en parken tijdens het pollenseizoen.</li>
                    <li>Laat was niet buiten drogen; pollen kunnen zich hechten aan kleding en beddengoed.</li>
                </ul>
                <h3>Wanneer en waar kun je beter naar buiten?</h3>
                <ul>
                    <li>Na een regenbui is de lucht schoner en bevat minder pollen.</li>
                    <li>In de herfst en winter zijn er veel minder pollen actief.</li>
                    <li>Aan zee of in de bergen is de hoeveelheid pollen vaak veel lager, ideaal voor vakanties.</li>
                </ul>
            </section>

            <section className="education-section">
                <h2>Medicatieadvies</h2>
                <p>
                    Soms kun je medicijnen gebruiken om minder last te hebben van hooikoorts. 
                    Er zijn tabletten (bijvoorbeeld cetirizine of loratadine) die je helpen tegen niezen en jeuk.
                    Als je vooral last hebt van een verstopte neus, kan een neusspray met een ontstekingsremmer helpen.
                    Heb je veel jeuk aan je ogen? Dan bestaan er speciale oogdruppels tegen allergieën.
                    Blijf je ondanks deze middelen veel klachten houden? Overleg dan met je huisarts. 
                    Soms is een langdurige behandeling (immunotherapie) mogelijk.
                </p>
            </section>

            <section className="education-section">
                <h2>Bronnen</h2>
                <ul>
                    <li><a href="https://www.thuisarts.nl/hooikoorts/ik-heb-hooikoorts" target="_blank" rel="noopener noreferrer">Thuisarts - Hooikoorts</a></li>
                    <li><a href="https://www.gezondheidsnet.nl/hooikoorts" target="_blank" rel="noopener noreferrer">Gezondheidsnet - Hooikoorts</a></li>
                    <li><a href="https://www.longfonds.nl/longziekten/astma/prikkels/hooikoorts" target="_blank" rel="noopener noreferrer">Longfonds - Hooikoorts</a></li>
                    <li><a href="https://www.rivm.nl/klimaat-en-gezondheid/allergenen" target="_blank" rel="noopener noreferrer">RIVM - Allergenen</a></li>
                </ul>
            </section>
        </div>
    );
};

export default EducationTips;
