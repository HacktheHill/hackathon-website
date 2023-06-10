import React from "react";
import "./Headshots.css";
import Headshot from "./Headshot";
import { t, locale } from "../../i18n";

const Headshots = () => {
	
	return (
		<div className="headshots" id="headshots">
			<h1>Meet the team</h1>
			<div className="org">
				<Headshot
					name="Disala"
					team= {t("headshot.team_codir_boy")}
					image="/headshots/co-director/disala.webp"
					instagram="disala_desilva"
					linkedin="disaladesilva"
				/>

				<Headshot 
					name="Mingye" 
					team= {t("headshot.team_codir_boy")}
					image="/headshots/co-director/mingye.webp"
					linkedin="mingye-chen-ca" 
				/>

				<Headshot
					name="Steven"
					team= {t("headshot.team_community")}
					image="/headshots/community/steven.webp"
					role= {t("headshot.role_dir_boy")}
					instagram="_stevenli"
					linkedin="-steven"
				/>

				<Headshot
					name="Fatimah"
					team= {t("headshot.team_design")}
					image="/headshots/design/fatimah.webp"
					role= {t("headshot.role_dir_girl")}
					instagram="fatimbit_v"
					linkedin="fatimah-vakily"
				/>

				<Headshot
					name="Daniel"
					team= {t("headshot.team_development")}
					image="/headshots/development/daniel.webp"
					role= {t("headshot.role_dir_boy")}
					instagram="arcanistzed"
					linkedin="arcanistzed"
				/>

				<Headshot
					name="Ali"
					team= {t("headshot.team_finance")}
					image="/headshots/finance/ali.webp"
					role= {t("headshot.team_codir_boy")}
					instagram="notalibhangu"
					linkedin="ali-raza-bhangu-061274214"
					
				/>

				<Headshot
					name="Pavly"
					team= {t("headshot.team_logistics")}
					image="/headshots/logistics/pavly.webp"
					role= {t("headshot.team_codir_boy")}
					instagram="pav_saleh"
					linkedin="pavly"
				/>

				<Headshot
					name="Tomer"
					team= {t("headshot.team_logistics")}
					image="/headshots/logistics/tomer.webp"
					role= {t("headshot.team_codir_boy")}
					instagram="tomersz12"
					linkedin="tomersz12"
				/>

				<Headshot
					name="Nyah"
					team= {t("headshot.team_marketing")}
					image="/headshots/marketing/nyah.webp"
					role={t("headshot.role_dir_girl")}
					linkedin="nyah-wagner-a62064192"
					
				/>

				<Headshot
					name="Kian"
					team={t("headshot.team_sponsorship")}
					image="/headshots/sponsorship/kian.webp"
					role= {t("headshot.role_dir_boy")}
					instagram="kiiankiing"
					linkedin="kiansalehi"
				/>

				<Headshot 
					name="Brandon" 
					team={t("headshot.team_community")}
					image="/headshots/community/brandon.webp"
					role={t("headshot.role_coord_boy")} 
				/>
				<Headshot
					name="Manaal"
					team= {t("headshot.team_community")}
					image="/headshots/community/manaal.webp"
					role= {t("headshot.role_coord_girl")}
					instagram="manaalm20"
					linkedin="manaal-mujeebuddin-ab2379199"
				/>

				<Headshot 
					name="Rafael" 
					team= {t("headshot.team_community")}
					image="/headshots/community/rafael.webp"
					role= {t("headshot.role_coord_boy")}
					linkedin="rafaelarif"
				/>

				<Headshot
					name="Saheen"
					team= {t("headshot.team_community")}
					image="/headshots/community/saheen.webp"
					role= {t("headshot.role_coord_boy")}
					linkedin="saheen-jeyarajah"
				/>

				<Headshot
					name="Emma"
					team={t("headshot.team_design")}
					image="/headshots/design/emma.webp"
					role={t("headshot.role_coord_girl")}
					instagram="et.tangg"
					linkedin="emmatang-"
				/>

				<Headshot 
					name="Sakeena"
					team={t("headshot.team_design")} 
					image="/headshots/design/sakeena.webp"
					role={t("headshot.role_coord_girl")}
				/>
				
				<Headshot 
					name="Sheena" 
					team={t("headshot.team_design")} 
					image="/headshots/design/sheena.webp"
					role={t("headshot.role_coord_girl")}
					linkedin="sheenaverana" 
				/>

				<Headshot
					name="Arjuunan"
					team={t("headshot.team_development")}
					image="/headshots/development/arjuunan.webp"
					role={t("headshot.role_coord_boy")}
					instagram="itsarjuunan"
					linkedin="arjuunan"
				/>

				<Headshot
					name="Aydin"
					team={t("headshot.team_development")}
					image="/headshots/development/aydin.webp"
					role={t("headshot.role_coord_boy")}
					instagram="ayay"
					linkedin="aydinyalcinkaya"
				/>

				<Headshot
					name="Emilien"
					team={t("headshot.team_development")}
					image="/headshots/development/emilien.webp"
					role={t("headshot.role_coord_boy")}
				/>

				<Headshot
					name="Farabi"
					team={t("headshot.team_development")}
					image="/headshots/development/farabi.webp"
					role={t("headshot.role_coord_boy")}
					instagram="farabi.01"
					linkedin="mfarabi"
					
				/>

				<Headshot 
					name="Sacha" 
					team={t("headshot.team_development")}
					image="/headshots/development/sacha.webp"
					role={t("headshot.role_coord_boy")}
					linkedin="sacha-ars" 
				/>

				<Headshot
					name="Stefan"
					team={t("headshot.team_development")}
					image="/headshots/development/stefan.webp"
					role={t("headshot.role_coord_boy")}
					instagram="steftodor"
					linkedin="todorovicstefan"
					
				/>

				<Headshot 
					name="Victor" 
					team={t("headshot.team_development")} 
					image="/headshots/development/victor.webp"
					role={t("headshot.role_coord_boy")}
				/>

				<Headshot
					name="Anna"
					team={t("headshot.team_logistics")}
					image="/headshots/logistics/anna.webp"
					role={t("headshot.role_coord_girl")}
					instagram="annarie_88"
					linkedin="anna-schubert-689620202"
				/>

				<Headshot
					name="Juan"
					team={t("headshot.team_logistics")}
					image="/headshots/logistics/juan.webp"
					role={t("headshot.role_coord_boy")}
					instagram="jchhhiedrap"
					linkedin="jchiedrap"
				/>

				<Headshot
					name="Philippe"
					team={t("headshot.team_logistics")}
					image="/headshots/logistics/philippe.webp"
					role={t("headshot.role_coord_boy")}
					instagram="philippegagne00"
					linkedin="p-gagne"
					
				/>

				<Headshot
					name="Satrajit"
					team={t("headshot.team_logistics")}
					image="/headshots/logistics/satrajit.webp"
					role={t("headshot.role_coord_boy")}
					instagram="satrajit.c"
					linkedin="satrajit-c"
					
				/>

				<Headshot
					name="Thinula"
					team={t("headshot.team_logistics")}
					image="/headshots/logistics/thinula.webp"
					role={t("headshot.role_coord_boy")}
					instagram="Thinula_desilva"
					linkedin="thinula-de-silva-0a4202228"
					
				/>

				<Headshot
					name="Andrea"
					team={t("headshot.team_marketing")}
					image="/headshots/marketing/andrea.webp"
					role={t("headshot.role_coord_girl")}
					instagram="dreatodor"
					linkedin="todorovic-andrea"
					
				/>

				<Headshot
					name="Anjaliya"
					team={t("headshot.team_marketing")}
					image="/headshots/marketing/anjaliya.webp"
					role={t("headshot.role_coord_girl")}
					instagram="anjievs"
					linkedin="anjaliya-sonnilal-859586257"
				/>

				<Headshot
					name="Kaitlyn"
					team={t("headshot.team_marketing")}
					image="/headshots/marketing/kaitlyn.webp"
					role={t("headshot.role_coord_girl")}
					instagram="callherkdaddy"
					linkedin="kaitlyn-dompaul-3485a7180"
				/>

				<Headshot
					name="Rabih"
					team={t("headshot.team_marketing")}
					image="/headshots/marketing/rabih.webp"
					role={t("headshot.role_coord_boy")}
					instagram="rabi3daoudd"
					linkedin="rabihdaoud"
				/>

				<Headshot
					name="Saif"
					team={t("headshot.team_marketing")}
					image="/headshots/marketing/saif.webp"
					role={t("headshot.role_coord_boy")}
					instagram="safesaif7"
					linkedin="saif-dine"
				/>

				<Headshot 
					name="Abbygail" 
					team={t("headshot.team_sponsorship")}
					image="/headshots/sponsorship/abbygail.webp"
					role={t("headshot.role_coord_girl")}
				/>

				<Headshot
					name="Erik"
					team={t("headshot.team_sponsorship")}
					image="/headshots/sponsorship/erik.webp"
					role={t("headshot.role_coord_boy")}
					instagram="erik_ang_"
					linkedin="erik-ang-97773b260"
					
				/>
				<Headshot
					name="Shreya"
					team={t("headshot.team_sponsorship")}
					image="/headshots/sponsorship/shreya.webp"
					role={t("headshot.role_coord_girl")}
					instagram="slanghe"
					linkedin="shreya-langhe"
					
				/>
				<Headshot
					name="Sophie"
					team={t("headshot.team_sponsorship")}
					image="/headshots/sponsorship/sophie.webp"
					role={t("headshot.role_coord_girl")}
					linkedin="sophie-tomlin-49163b20b"
					
				/>
				<Headshot
					name="Zahra"
					team={t("headshot.team_sponsorship")}
					image="/headshots/sponsorship/zahra.webp"
					role={t("headshot.role_coord_girl")}
					instagram="zahrasnva"
					linkedin="zahra-suleymanova"	
				/> 
			</div>
		</div>
	);
};

export default Headshots;
