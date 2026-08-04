import hiyanjaniImage from "../../../public/heads/hiyanjani-web.jpg";
import nikitaImage from "../../../public/heads/nikita-web.jpg";
import ridaImage from "../../../public/heads/rida-web.jpg";
import touseebImage from "../../../public/heads/touseeb-web.jpg";
import praptiImage from "../../../public/heads/prapti-web.jpg";

const heads = [
  ["Vaidehi", "President", "https://i.postimg.cc/L5qYXLJX/IMG-20260626-WA0014.jpg"],
  ["Swarnika", "Vice President", "https://i.postimg.cc/pd2mjgmZ/IMG-20260626-WA0015.jpg"],
  ["Hiyanjani", "Secretary General", hiyanjaniImage.src],
  ["Tanishqa", "Editorial", "https://i.postimg.cc/SRc5xZmp/IMG-20260702-WA0004.jpg"],
  ["Abhinav", "Tech & Operations", "https://i.postimg.cc/zvmHPpzc/lv-0-20260624171114.jpg"],
  ["Srishti", "Tech & Operations", "https://i.postimg.cc/bN1QQrXM/Screenshot-20260626-183348-Insta-Gold-2.jpg"],
  ["Yogita", "Social Media", "https://i.postimg.cc/DZLRKYcd/IMG-20260626-WA0005.jpg"],
  ["Kashvi", "Social Media", "https://i.postimg.cc/nzFqHXKp/IMG-20260626-WA0008.jpg"],
  ["Rida", "Design", ridaImage.src],
  ["Aastha", "Design", "https://i.postimg.cc/Cx557jF7/IMG-20260626-WA0004.jpg"],
  ["Nikita", "Editorial", nikitaImage.src],
  ["Aarsi", "Podcast", "https://i.postimg.cc/SxQ4fqG0/IMG-20260626-WA0007.jpg"],
  ["Nishka", "Outreach", "https://i.postimg.cc/fTR5FyqM/IMG-20260626-WA0009.jpg"],
  ["Chetana", "Outreach", "https://i.postimg.cc/wTvFXGmM/IMG-20260626-WA0010.jpg"],
  ["Touseeb", "Discussion", touseebImage.src],
  ["Vaibhav", "Discussion", "https://i.postimg.cc/rFsCjbzk/IMG-20260626-WA0012.jpg"],
  ["Prapti", "Research Projects", praptiImage.src],
  ["Yashvi", "Research Projects", "https://i.postimg.cc/PJfZCJjy/IMG-20260702-WA0005.jpg"],
];

export default function Heads() {
  return <main className="contributors-page"><h1>Heads.</h1><div>{heads.map(([name, role, image]) => <article key={name}><div className="contributor-photo" style={{ backgroundImage: `url(${image})` }}/><div><h2>{name}</h2><p>{role}</p></div></article>)}</div></main>;
}
