// Initialize map
const map = L.map('map').setView([37.422, 141.032], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Shared elements
const introBg = document.getElementById('intro-bg');
const introText = document.getElementById('intro-text');
const disclaimer = document.getElementById('disclaimer');
const mapUI = document.getElementById('mapUI');
const mapElement = document.getElementById('map');
const introBtn = document.getElementById('reopenIntro');
const referenceBtn = document.getElementById('referenceBtn');
const continueBtn = document.getElementById('continue-btn');
const enterBtn = document.getElementById('enter-btn');
const bgAudio = document.getElementById('bg-audio');

// Step 3: Show disclaimer
function showDisclaimer() {
  introText.classList.add('hidden');
  introText.classList.remove('show');

  disclaimer.classList.remove('hidden');
  disclaimer.style.display = 'flex';
  disclaimer.classList.add('show');

   document.querySelector('#intro-text .modal-content').scrollTop = 0;
  document.querySelector('#disclaimer .modal-content').scrollTop = 0;
}

// Step 4: Enter → fade out disclaimer, show map, play audio
function enterExperience() {
  // Try to play audio immediately
  if (bgAudio) {
    bgAudio.volume = 0.4;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => console.log("Audio playback started"))
        .catch(err => console.warn("Audio playback blocked:", err));
    }
  }

  // Transitions
  disclaimer.classList.remove('show');
  disclaimer.classList.add('fade-out');
  introBg.classList.remove('fade-in');

  setTimeout(() => {
    disclaimer.classList.add('hidden');
    disclaimer.style.display = 'none';
    introBg.style.display = 'none';

    mapUI.style.display = 'block';
    mapUI.classList.add('show');
    mapElement.classList.add('show');

    introBtn.style.display = 'block';
    referenceBtn.style.display = 'block';

    setTimeout(() => {
      introBtn.classList.add('show');
      referenceBtn.classList.add('show');
    }, 10);
  }, 1200);
}

// Page intro logic
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    introBg.classList.add('fade-in');
  }, 100);

  setTimeout(() => {
    introText.classList.remove('hidden');
    introText.classList.add('show');
  }, 2100);

  // Attach buttons
  continueBtn.addEventListener('click', showDisclaimer);
  enterBtn.addEventListener('click', enterExperience);
});

// Reopen Intro
function openIntro() {
  mapUI.classList.remove('show');
  mapUI.style.display = 'none';
  mapElement.classList.remove('show');

  disclaimer.classList.remove('show', 'fade-out');
  disclaimer.classList.add('hidden');
  disclaimer.style.display = 'none';

  introBg.style.display = 'block';
  setTimeout(() => {
    introBg.classList.add('fade-in');
  }, 10);

  introText.classList.remove('hidden');
  introText.classList.add('show');

  introBtn.classList.remove('show');
  referenceBtn.classList.remove('show');

  setTimeout(() => {
    introBtn.style.display = 'none';
    referenceBtn.style.display = 'none';
  }, 500);

  exitBtn.classList.remove('show');
setTimeout(() => {
  exitBtn.style.display = 'none';
}, 500); // wait for fade-out if needed

}



// Initialize custom pane for markers

// Create panes only once
map.createPane('zonePrimeMinister');
map.getPane('zonePrimeMinister').style.zIndex = 600;

map.createPane('markerPane');
map.getPane('markerPane').style.zIndex = 652;

// Define actors with modal support and timeline phases
const actors = [
  {
    name: "TEPCO Executive",
    coords: [35.68, 139.76],
    img: "tepco.jpg",
    text: "We face not only a natural disaster—but a political one.",
    id: "tepco",
    phase: "march11"
  },
  {
    name: "Plant Worker",
    coords: [37.421, 141.032],
    img: "plant-worker.jpg",
    text: "We’re trying to keep moving, but I don’t know what will happen, what tomorrow will bring.",
    id: "plantWorker",
    phase: "march11"
  },
  {
    name: "Citizen",
    coords: [37.45, 141.02],
    img: "citizen.jpg",
    text: "We don’t just rebuild homes—we rebuild the strength to carry on.",
    id: "citizen",
    phase: "march11"
  },
  {
    name: "Mayor",
    coords: [37.63, 141.00],
    img: "mayor.jpg",
    text: "Minamisoma is more than a place. It’s a memory we carry, even as we leave it behind.",
    id: "mayor",
    phase: "evacuation"
  },
  {
    name: "Scientist",
    coords: [37.75, 140.53],
    img: "scientist.jpg",
    text: "It’s difficult to predict the full scope of the consequences. But we can’t afford to pretend otherwise.",
    id: "scientist",
    phase: "evacuation"
  },
  {
    name: "Cleanup Crew",
    coords: [37.60, 140.75],
    img: "cleanup.jpg",
    text: "A lot remains unknown. But we’re still here, trying to hold the line.",
    id: "cleanup",
    phase: "evacuation"
  },
  {
    name: "Greenpeace Executive",
    coords: [38.4, 140.84],
    img: "observer.jpg",
    text: "At this stage, it is clear that the Fukushima disaster is not only a national crisis but a global one.",
    id: "greenpeace",
    phase: "evacuation"
  },
  {
    name: "Child",
    coords: [37.30, 140.90],
    img: "child.jpg",
    text: "Please don’t let me forget. And please don’t forget me.",
    id: "child",
    phase: "legacy"
  },
  {
    name: "Government Official",
    coords: [35.7, 139.57],
    img: "gov-official.jpg",
    text: "Fukushima didn’t collapse from ignorance. It collapsed under the weight of decisions made in full awareness of risk.",
    id: "govOfficial",
    phase: "legacy"
  }
];

// Add actor markers
const actorMarkers = [];
const viewedActors = new Set();
const totalActors = actors.length;

actors.forEach(actor => {
  const marker = L.marker(actor.coords, {
    pane: 'markerPane',
    title: actor.name,
    phase: actor.phase
  }).addTo(map)
    .bindPopup(`
      <div style="max-width: 250px;">
        <img src="assets/images/${actor.img}" class="popup-img"/>
        <h3>${actor.name}</h3>
        <p><i>"${actor.text}"</i></p>
        ${actor.id ? `<p><a href='#' onclick="openLetterModal('${actor.id}'); return false;">Read full letter</a></p>` : ""}
      </div>  
    `);

  marker.actorPhase = actor.phase;

  // Track when this marker is clicked
  marker.on('click', () => {
    // Open popup first
    marker.openPopup();

    // Get marker coordinates and center the map there
    const popupLatLng = marker.getLatLng();

    // Pan the map to center exactly on the popup (you can offset if needed)
    map.panTo(popupLatLng, {
      animate: true,
      duration: 0.5
    });

    // Track viewed actors
    viewedActors.add(actor.name);

    if (viewedActors.size === totalActors) {
      const chime = document.getElementById("chimeSound");
      const ambient = document.getElementById("bg-audio");

      if (ambient) ambient.volume = 0.2;
      if (chime) {
        chime.volume = 0.8;
        chime.play();
      }

      setTimeout(() => {
        if (ambient) ambient.volume = 0.5;
      }, 2500);

      const exitBtn = document.getElementById("openExit");
      exitBtn.style.display = "block"; // Make it visible
      setTimeout(() => {
        exitBtn.classList.add("show"); // Then fade it in
      }, 10);
    }
  });

  actorMarkers.push(marker); // Ensure markers are added to the actorMarkers array
});

// Timeline phase filtering
function togglePhase(phase) {
  actorMarkers.forEach(marker => {
    const actorPhase = marker.actorPhase; // Use the custom actorPhase property
    const shouldShow = phase === "all" || actorPhase === phase;
    const markerEl = marker.getElement();

    if (shouldShow) {
      if (!map.hasLayer(marker)) {
        marker.addTo(map);
      }
      if (markerEl) {
        markerEl.style.transition = 'opacity 0.4s ease-in-out';
        markerEl.style.opacity = '1';
      }
    } else {
      if (markerEl) {
        markerEl.style.transition = 'opacity 0.4s ease-in-out';
        markerEl.style.opacity = '0';
        setTimeout(() => {
          if (map.hasLayer(marker)) map.removeLayer(marker);
        }, 400); // Wait for fade-out before removing
      } else {
        map.removeLayer(marker);
      }
    }
  });
}


function openLetterModal(actorId) {
  const modal = document.getElementById("letterModal");
  const content = document.getElementById("modalContent");

  // Define the letters dictionary
  const letters = {
    tepco: `
    <p><strong>Date:</strong> March 22, 2011<br>
<strong>To:</strong> Senior Board Members and Key Stakeholders</p>

<p>As we continue to navigate the evolving situation at the Fukushima Daiichi Nuclear Plant, I write to update you on our official response and to provide some clarity regarding the public narrative that has already begun to take shape. There is no question that the events of March 11, 2011, represent an unprecedented challenge for the company and the nation at large, and we are acutely aware of the gravity of the situation.</p>

<p>However, we must be measured in how we communicate our actions, both internally and externally, in the days ahead. The current media frenzy, while understandable given the scale of the disaster, is beginning to veer dangerously toward sensationalism. It is crucial that we continue to frame the narrative with a focus on the facts: that Fukushima Daiichi, like many other plants, was designed and built according to the regulatory standards and technological expectations of its time.</p>

<p>It is important to remember that the Fukushima Daiichi Nuclear Plant was built to withstand certain thresholds, and no engineering solution could have predicted a combination of natural forces as extraordinary as those we encountered. The earthquake—though devastating in its magnitude—was within the realm of historical precedent. The tsunami that followed, however, far exceeded any models we had for such a disaster, and we are currently assessing whether additional, unforeseen factors contributed to the breaches in the cooling systems.</p>

<p>In this context, any suggestion that the company was grossly negligent or irresponsible is unfounded. It is critical that we continue to underline the proactive steps TEPCO took, even in the face of unimaginable challenges. While the situation remains dire, our engineers and personnel acted swiftly to address the immediate safety risks, to prevent further escalation, and to support the evacuation of local communities. We are fully committed to limiting the environmental and public health impacts, and we will continue to offer full cooperation with government investigations.</p>

<p>That said, the tone of the commentary coming from both domestic and international critics is becoming increasingly adversarial. There are calls for executive resignations, for compensatory measures beyond what is legally required, and for a complete overhaul of the company's operational procedures. While we will comply with all necessary regulations, we must remain mindful of the legal and financial implications of such demands. A rush to public appeasement could severely undermine the company’s standing in future negotiations, especially with our investors, stakeholders, and international partners.</p>

<p>As part of our ongoing commitment to transparency, I am overseeing the creation of an independent review board that will evaluate the disaster’s causes. But let us not forget that we face not only a natural disaster but also a political one. There will be moments when public perception will drive decisions more than objective facts. We must guard against allowing ourselves to be pushed into positions that would compromise the company’s future stability.</p>

<p>Our primary task now is damage control—not just of the plant, but of the company’s reputation. While the immediate crisis demands urgent action, we must also look toward long-term recovery. This means aligning ourselves with the national interest while protecting TEPCO’s interests in the face of both legal and public scrutiny.</p>

<p>In closing, I urge you all to remain calm and focused as we continue to navigate these turbulent times. We have weathered storms before, and we will emerge from this stronger, as we always do. But it will require unity, measured responses, and strategic communication at every level.</p>

<p>I will keep you updated as more information becomes available.</p>

<p>Sincerely,<br>
S. Nakajima, Executive Officer<br>
Tokyo Electric Power Company (TEPCO)</p>

    `,
    plantWorker: `
 
<p><em>This letter is a fictional account, shaped by historical records, news coverage, and imagined inner life. It does not aim to represent any one individual, but to evoke the emotional reality of those working under extreme risk.</em></p>

<p><strong>Date:</strong> March 11, 2011</p>

<p><strong>Dearest,</strong></p>

<p>I don’t know what’s happening. Everything hit at once, the shaking, the alarms are deafening, people are yelling to get out. Phones aren’t working. Radios are cutting in and out.</p>

<p>We’re still at the plant. Some areas are being cleared. I don’t know if I’ll be sent somewhere else or if we’re expected to hold the line here. I just know I wanted to write this down in case I don’t get another chance.</p>

<p>I’m terrified, if I’m honest. Everyone is. We’re trying to keep moving, but I don’t know what will happen, what tomorrow will bring, but just know that I’m thinking of you.</p>

<p><strong>Love,<br>
Haru</strong></p>

    `,
    citizen: `
   <p><em>This written piece is fictionalised and meant to reflect on how community, memory, and adaptation take shape in the wake of collective upheaval.</em></p>

<p><strong>Untitled Entry<br>
27th March 2011</strong></p>

<p>The light today was thin, like it didn’t want to stay.</p>

<p>I stood by the edge of the temporary shelter, watching a boy try to catch dust in a paper cup. He kept missing. I think he knew he would. Still, he kept trying. It reminded me of how my mother used to fold the sheets in half before they dried—so they wouldn’t hold the wind too tightly.</p>

<p>That’s how it feels here. Like everything we touch might disappear if we press too hard.</p>

<p>When the earth shook, I didn’t scream. The dishes falling, the dogs barking, the silence between things collapsing. I thought of how still our home always felt at that hour—how the kettle would whistle once, then sigh. It was a form of kinetic paralysis.</p>

<p>We left without turning off the lights. I still wonder if they stayed on, if they flickered, if the hallways are still glowing now that we’re gone.</p>

<p>At the centre, the days don’t start or end. Someone sings softly in the mornings. A woman braids her daughter’s hair with a string she found. A man lines up empty bottles on the windowsill, as if measuring time by light. No one talks about going back. Only forward, though the word tastes like paper—dry and weightless.</p>

<p>Sometimes I dream of walking home. But the roads are crooked, the shops are selling things I’ve never seen, and the sky perpetually adorns a shade unbefitting. I’m not sure if it’s my memory anymore. I don’t know if I want to go home or just remember it—as it was, not as it is now, in all its fallen glory.</p>

<p>People say we are rebuilding. I suppose that’s true. But some things stay broken in ways we can’t explain. A cracked bowl still holds water. But you learn to carry it differently. I think I do now.</p>

<p>Today, a child laughed—really laughed. I looked up like it was thunder.<br>
Maybe that’s something, too.</p>

<p><strong>—Y.</strong></p>

    `,
    mayor: `
  <p><strong>Date:</strong> March 20, 2011</p>

<p><strong>Dear Residents of Minamisoma,</strong></p>

<p>I write to you with a heavy heart, acknowledging the immense challenges we are all facing in the wake of the earthquake, tsunami, and the ongoing crisis at the Fukushima Daiichi Nuclear Plant. We find ourselves in an unprecedented situation, but please know that your safety remains my highest priority, and I will continue to work alongside national and local authorities to navigate this difficult time.</p>

<p>Many of you have already had to evacuate, and I understand the deep uncertainty this has caused. While we are still assessing the full scope of the damage, it is clear that the radiation levels in certain areas have risen to concerning levels. As of now, the evacuation orders are in place, as we continue to monitor radiation levels and implement precautionary measures to ensure your safety.</p>

<p>Our community is resilient, but this crisis has tested us in ways we could not have anticipated. Minamisoma is more than just a town—it is a community built on strong ties, shared memories, and a collective spirit that has withstood many challenges over the years. Though we face a future filled with uncertainty, I urge you all to hold on to that spirit as we begin the long and difficult road ahead.</p>

<p>We are working diligently to provide support for all evacuees, and shelters are available for those in need of a place to stay. Food, medical supplies, and other essential resources are being distributed to ensure that you have access to everything necessary during this time. I encourage you to reach out if you need assistance. We are in this together, and no one will be left behind.</p>

<p>I also want to reassure you that we are in constant communication with experts regarding the nuclear situation. The situation at the Fukushima Daiichi plant is being monitored closely, and all efforts are being made to stabilise it. Although we do not yet know the full impact of the radiation or the long-term effects on our town, we are doing everything in our power to minimise further risks.</p>

<p>I know that many of you are worried about your homes, your livelihoods, and the future of Minamisoma. Please understand that while this situation is dire, our collective strength as a community will guide us through. The road to recovery will be long, but it is not one we will travel alone. Together, we will rebuild, and together, we will restore what has been lost.</p>

<p>I will continue to keep you informed as we move forward, and I remain deeply grateful for your courage and patience during this difficult time.</p>

<p>Sincerely,<br>
Katsunoba Sakurai</p>

    `,
    scientist: `
     <p><strong>Date:</strong> March 14, 2011</p>

<p><strong>To Whom It May Concern,</strong></p>

<p>I am writing to provide an update on the current situation at Fukushima Daiichi. As of now, the plant is facing significant challenges in containing the damage caused by the earthquake and tsunami. The reactors are showing signs of serious instability, and radiation levels are higher than we anticipated. We are actively working to assess the situation, but at this point, it’s clear that the full extent of the damage is still unfolding.</p>

<p>Our priority is ensuring the safety of both the plant personnel and the surrounding population. Evacuations are being conducted in a controlled manner, and we are making efforts to stabilise the reactors, though this is proving more difficult than expected. The cooling systems have failed in several reactors, and the potential for further radiation release remains a critical concern.</p>

<p>While we are working around the clock to manage this crisis, it’s important to acknowledge that the situation is not entirely under control at this stage. There are operational and technical challenges that are still being addressed. However, public communication has become an increasingly complex issue. I am aware that there is significant pressure to present a less alarming picture of the situation, especially given the potential for widespread panic.</p>

<p>I understand the need for calm and stability, but I must also stress that, from a technical standpoint, this is a serious event. The conditions are evolving, and it’s difficult to predict the full scope of the consequences at this time. I am doing everything in my capacity to mitigate the risks, but I believe it is important that the full complexity of the situation is communicated, even if that means presenting difficult truths.</p>

<p>I hope this letter serves to clarify the reality of the situation. We are working diligently to address the immediate issues and will continue to provide updates as we gather more data.</p>

<p>Best regards,<br>
K. T.</p>

    `,
    cleanup: `
     <p><strong>Date:</strong> March 18, 2011</p>

<p><strong>To Whom It May Concern,</strong></p>

<p>I am writing to provide an update on the ongoing cleanup efforts at the Fukushima Daiichi Nuclear Plant. The situation remains challenging, and we are focused on mitigating the immediate risks while progressing with stabilisation and remediation tasks.</p>

<p>Our team is actively working to stabilise the reactors that remain affected. We’ve made progress in containing some of the radiation leaks, but radiation levels continue to be higher than expected. The spread of contamination has also extended beyond the plant, which has complicated our efforts. We are monitoring radiation levels closely, but given the extent of the damage, there are still areas that remain unsafe for extended exposure.</p>

<p>We are continuing the process of decontaminating the affected zones, though it is slow and methodical work. Containment procedures are ongoing to limit further spread, and additional safety measures are being implemented as needed. While progress is being made, the complexity of the situation means we must remain cautious in our approach.</p>

<p>The uncertainty of the situation is a challenge. We are unsure of the full extent of the contamination or the long-term environmental effects, as the data continues to evolve. It is difficult to predict the long-term impact of radiation exposure on both the plant site and surrounding areas. Our primary focus remains on containment, stabilisation, and ensuring the safety of the workers involved.</p>

<p>While the cleanup process is ongoing, it is clear that the work will take a significant amount of time. We are committed to following strict safety protocols and continuing our efforts to minimise the risk to both workers and the general population, but we need more information and transparency.</p>

<p>We will continue to monitor the situation and provide further updates as new information becomes available.</p>

<p>Best regards,<br>
H. S.</p>

    `,
    greenpeace: `
   <p><strong>March 22, 2011</strong></p>
     <strong>To:</strong> Kumi Naidoo, Executive Director, Greenpeace International<br>

  <p>Dear Kumi,</p>

  <p>As we continue to assess the evolving situation at the Fukushima Daiichi Nuclear Power Plant following the March 11 earthquake and tsunami, I am writing to provide an update from Japan and to offer suggestions for how Greenpeace International might position its public and policy responses moving forward.</p>

  <p>At this stage, it is clear that the Fukushima disaster is not only a national crisis but a global one—raising significant concerns around nuclear safety, risk management, regulatory accountability, and environmental governance. While local media coverage remains relatively restrained, there is increasing public disillusionment with official narratives, particularly around the extent of radiation release, the management of spent fuel, and the delays in emergency communication.</p>

  <p>Greenpeace Japan is currently coordinating efforts to collect data, support local civil society groups, and engage with independent experts to document radiation exposure and potential long-term environmental impacts. Based on preliminary assessments and past patterns of regulatory failure, we believe this disaster reveals fundamental flaws in Japan’s nuclear risk governance framework—especially its overreliance on probabilistic safety models and the lack of sufficient multi-hazard contingency planning.</p>

  <p>Specifically, we are urging international attention to the following concerns:</p>

  <ul>
    <li><strong>Regulatory capture</strong> and the close relationship between nuclear operators (especially TEPCO) and oversight agencies, which hindered early interventions.</li>
    <li><strong>Insufficient tsunami modelling and infrastructure hardening</strong>, despite repeated warnings from independent seismologists and safety engineers.</li>
    <li><strong>Opaque communication protocols</strong> that have contributed to confusion and eroded public trust.</li>
    <li><strong>Unresolved long-term waste storage issues</strong>, now exacerbated by infrastructure damage and reactor instability.</li>
  </ul>

  <p>We recommend that Greenpeace International continue to frame this event not as an exceptional failure, but as an inevitable consequence of systemic risk within tightly coupled and aging nuclear systems. Furthermore, as we’ve discussed in previous campaigns, the continued reliance on nuclear energy undermines global commitments to sustainable and resilient energy transitions. We see this moment as a critical juncture for mobilising international discourse around energy justice, environmental precaution, and the need to accelerate investment in decentralised, renewable alternatives.</p>

  <p>Greenpeace Japan will continue to monitor developments and coordinate with allies in science, policy, and civil society. We are preparing public briefings and supporting calls for greater transparency from Japanese authorities. Your support in amplifying this work globally will be essential in the coming weeks, particularly as international media attention grows and political narratives begin to shift.</p>

  <p>Please let us know how we can align messaging and share resources. I also suggest convening a strategy meeting across regional teams within the next few days to consolidate our recommendations.</p>

  <p>In solidarity,<br>
  <strong>Ayako Mori</strong><br>

    `,
    child: `
    <p><em>This letter is fictional. It was written in an attempt to explore the emotional aftermath of displacement and grief. It is not based on a real person, but inspired by the enduring effects of Fukushima on families and children.</em></p>

<p><strong>Date:</strong> April 10, 2016</p>

<p><strong>Dear Mama and Papa,</strong></p>

<p>I don't know if this letter will ever reach you, but I need to write it. I need to say things I can’t say out loud because sometimes, it feels like the words are stuck in my throat and I don’t know how to make them come out.</p>

<p>I’m sitting in the new house, the one Grandma and Grandpa brought me to. It’s not the house we talked about, the one by the river with the big tree in the yard where I was going to climb and play when I got bigger. I can still picture it in my head, but the more I think about it, the harder it gets to see it clearly. It’s like the memory’s getting foggy. I can still hear you guys, when you said we’d always be together there. And I can almost feel Mama’s hand in mine when you said we’d watch the sunset from the porch every evening. I try to hold on to that feeling, but it’s slipping away.</p>

<p>This house feels so empty. The walls are big and far apart, and no matter how much I try to make it feel like home, it just doesn't. It doesn’t feel safe like the place where we used to live. The rooms are cold, and the air doesn’t smell right. It's different here.</p>

<p>I still look for you sometimes, like if I just turn the corner or open the door, you’ll be there, waiting for me. I ask Grandma and Grandpa about you, and they just give me that sad look and say you’re gone. But how can you be gone? You were right there, right next to me. One minute I was with you, and then came nothing. It doesn’t make sense.</p>

<p>Sometimes I feel like I can’t breathe when I think about how fast everything changed. How you’re not here, how I’ll never get to hear you call me by my name again, or how I’ll never see Papa smile when he makes dinner. It’s so hard, and I don’t know how to make it stop hurting.</p>

<p>I feel like I’m carrying something heavy inside, like a weight that I can’t get rid of. It doesn’t go away. Sometimes it feels like it’s too much, like the emptiness in the house is inside me too. When I close my eyes, I can still see you, but it doesn’t feel real anymore. I can’t feel you holding me like I used to. I can’t hear your voice telling me everything’s going to be okay.</p>

<p>Writing this feels like the only way I can get close to you again. I don’t know if it’ll help, but I’m hoping if I say it, if I write it down, it’ll make me feel like you’re still here with me. But I miss you so much, more than I know how to say. I just want to hear you laugh again. I just want you to hold me.</p>

<p>I know I have to be strong, but sometimes I don’t know how. I try to be brave for Grandma and Grandpa, but when I’m alone, it’s harder. I wish you were still here. I wish I could go back. I miss you so much, and I don’t want to forget. Please don’t let me forget and please don't forget me.</p>

<p>With all my love,<br>
Megumi</p>

    `,
    govOfficial: `
      <p><strong>Date:</strong> October 9, 2042<br>
<strong>Internal Memorandum – For Restricted Circulation Only</strong><br>
<strong>To:</strong> Select Committee on Crisis Management and Systemic Risk<br>

<p>This memo remains internal and is not intended for public release. Its purpose is to orient our current discussions surrounding national preparedness frameworks in light of recent failures. As we evaluate ongoing energy security measures and climate-adaptive infrastructure planning, it is instructive—though not always comfortable—to revisit Fukushima.</p>

<p>It is tempting, with the distance of decades, to flatten past disasters into object lessons. To extract from them the language of failure or triumph. Yet such terms are, at best, context-dependent and, at worst, obstructive. The 2011 Fukushima Daiichi incident has long been mythologised as a turning point—proof, we claimed, of the dangers of complacency and the necessity of reform. But what, precisely, was reformed? What was remembered, and what was reabsorbed into the bureaucratic status quo?</p>

<p>The conventional framing insists that Fukushima was a failure of foresight. But foresight did exist—just not where institutions were prepared to acknowledge it. Internal warnings about tsunami modeling, aging backup systems, and evacuation protocol gaps circulated in the years leading up to the event. These were not ignored outright. They were, as is often the case, contextualised. Balanced against budget forecasts. Tabled in subcommittees. This is not neglect—it is governance. It is the work of managing impossibilities under the pretense of rationality.</p>

<p>We must resist the urge to read historical documents as evidence of institutional blindness. Rather, they show us something far more difficult: the extent to which knowledge can be known and still remain politically un-actionable. Fukushima did not collapse due to ignorance. It collapsed under the weight of decisions made in full awareness of risk.</p>

<p>We find ourselves now—three decades later—circling familiar terrain. Once again, we face mounting projections, this time about water scarcity thresholds, heat resilience failures, cyber-physical vulnerabilities. The parallels are uncomfortable. Warnings are circulating, experts are testifying, and contingency plans remain underfunded.</p>

<p>Some among our younger staff have called for a public participation: a release of internal assessments, a public acknowledgment of infrastructural risk, a more transparent engagement. These suggestions are not without merit. But they carry consequences—for market stability, for diplomatic relations, for public trust already strained by years of fragmented messaging.</p>

<p>We must be careful not to conflate transparency with strategy, nor morality with governance. History teaches us not just what was broken, but how easily even critical reflection can become another form of containment.</p>

<p>Fukushima remains an important reference point, not because it was unique, but because it wasn’t. We should remember it not as the moment things failed, but as the moment failure became legible.</p>

<p><em>Let us proceed accordingly.</em><br>
— Confidential, M.</p>

    `
  };

  // Get the letter based on actorId or fallback if not found
  const letter = letters[actorId] || `<p><b>${actorId}</b> content not found.</p>`;

  content.innerHTML = letter;
  modal.classList.remove("hidden");
}
function showExitModal() {
  const modal = document.getElementById("exitModal");
  const modalBg = modal.querySelector('.modal-bg');

  // Show modal and fade in both
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("show");
    modalBg.classList.add("show");
  }, 10);
}

function closeExit() {
  const modal = document.getElementById("exitModal");
  const modalBg = modal.querySelector('.modal-bg');

  // Fade out both
  modal.classList.remove("show");
  modalBg.classList.remove("show");

  setTimeout(() => {
    modal.style.display = "none";
  }, 1500); // Match CSS transition
}

function openReference() {
  const modal = document.getElementById("referenceModal");
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
  document.querySelector('#referenceModal .modal-content').scrollTop = 0;
}

function closeReference() {
  const modal = document.getElementById("referenceModal");
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 500); // Match fade-out transition
}


// Evacuation Zones (stacked with custom pane z-index)
map.createPane('zoneTop');
map.getPane('zoneTop').style.zIndex = 650;

map.createPane('zoneMiddle');
map.getPane('zoneMiddle').style.zIndex = 640;

map.createPane('zoneBottom');
map.getPane('zoneBottom').style.zIndex = 630;


const zones = [
  {
    coords: [[37.45, 141.00],[37.45, 141.06],[37.38, 141.06],[37.38, 141.00]],
    color: "#f03",
    label: "Exclusion Zone (0–20 km)",
    pane: "zoneTop"
  },
  {
    coords: [[37.50, 140.95],[37.50, 141.12],[37.35, 141.12],[37.35, 140.95]],
    color: "orange",
    label: "Voluntary Evacuation Zone (20–30 km)",
    pane: "zoneMiddle"
  },
  {
    coords: [[37.55, 140.90],[37.55, 141.18],[37.32, 141.18],[37.32, 140.90]],
    color: "yellow",
    label: "Hotspot Monitoring Zone (30–45 km)",
    pane: "zoneBottom"
  }
];

zones.forEach(zone => {
  let polygon = L.polygon(zone.coords, {
    color: zone.color,
    fillColor: zone.color,
    fillOpacity: 0.3,
    pane: zone.pane
    
  }).addTo(map);
  polygon.getElement().classList.add("zone-glow");

  polygon.bindPopup(`<b>${zone.label}</b>`);

  polygon.on('mouseover', function () {
    this.setStyle({ fillOpacity: 0.6 });
  });

  polygon.on('mouseout', function () {
    this.setStyle({ fillOpacity: 0.3 });
  });
});


// Prime Minister – Symbolic Coverage (Tokyo)
var primeMinisterZone = L.polygon([
  [35.80, 139.50],
  [35.80, 139.95],
  [35.55, 139.95],
  [35.55, 139.50]
], {
  color: '#333',
  weight: 1,
  fillColor: '#000',
  fillOpacity: 0.01, // nearly invisible
  pane: "markerPane"
}).addTo(map);

primeMinisterZone.bindPopup(`
  <div style="
    max-width: 320px;
    max-height: 220px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 10px;
    font-family: 'Georgia', serif;
    font-size: 14px;
    line-height: 1.6;
    color: #222;
  ">
    <strong>Prime Minister – Tokyo</strong><br><br>

    <p><em>My fellow citizens,</em></p>

    <p>First and foremost, my heart lies with those affected by the nuclear accident at the Fukushima Daiichi Plant. I assure you that the government is fully committed to protecting the lives and well-being of every citizen. We are doing everything within our power to ensure that those who have been displaced by the tsunami are receiving the care and support they need. Emergency teams are working tirelessly across the nation, and our first priority is to provide aid to the regions most affected.</p>

    <p>Regarding the situation at Fukushima, I want to assure the public that we, the government, in close coordination with TEPCO and other relevant agencies, are working around the clock to contain the situation. The safety of the Japanese people is our utmost concern, and we are taking every necessary measure to prevent further harm. We are closely monitoring radiation levels, and evacuations are being carried out as a precaution.</p>

    <p>I understand that this situation has caused anxiety and uncertainty across the country. We must not be swayed by fear but remain resolute and united in the face of this crisis. Japan is resilient, not because we are unshaken, but because we have always endured, adapted, and rebuilt. We will face this challenge together, with courage and with determination.</p>

    <p>I ask for your continued patience and cooperation as we work to resolve this crisis. I assure you that we will provide clear and timely updates as the situation develops. The government remains committed to transparency, and we will ensure that the truth is known to all, despite the difficulties we face.</p>

    <p>In this difficult time, let us all come together as one nation, united in solidarity. Our thoughts are with the people who have lost so much, and together, we will rebuild our future.</p>
  </div>
`);

//  Radiation Drift Zone
map.createPane('zoneDrift');
map.getPane('zoneDrift').style.zIndex = 620;

L.circle([37.38, 141.03], {
  radius: 78000, // ~78 km radius
  color: "#66ccff",
  fillColor: "#66ccff",
  fillOpacity: 0.2,
  pane: "zoneDrift"
}).addTo(map).bindPopup("<b>Radiation Drift Zone (~80 km)</b>");

document.getElementById("closeModal").addEventListener("click", () => {
  const modal = document.getElementById("letterModal");
  modal.classList.add("hidden");
});