const express = require("express");
const router = express.Router();

const {
  Users,
  Admins,
  Services,
  ServiceRequirements,
  Skills,
  UserSkills,
  Works,
  ServiceOrder,
  OrderedRequirements,
  UserLanguages,
  UserSocialMedias,
  UserKnowledgeAreas,
  UserProfessions,
  Knowledge,
  Professions,
} = require("../models");
router.get("/", async (req, res) => {
  const userData = await Users.findAll();
  res.json(userData);
});
router.post("/", async (req, res) => {
  const bod = req.body;
  await Users.create(bod);
  res.send(bod);
});
router.get("/admins", async (req, res) => {
  const userData = await Admins.findAll();
  res.json(userData);
});
router.post("/admins", async (req, res) => {
  const bod = req.body;
  await Admins.create(bod);
  res.send(bod);
});
router.post("/update", async (req, res) => {
  console.log(req.body);
  const updatedUserData = {
    currentlyWorkingAs: req.body.currentlyWorkingAs,
    occLevel: req.body.occLevel,
  };
  Users.update(updatedUserData, {
    where: {
      id: req.body.userId,
    },
  });
  res.send(req.body);
});
router.post("/works", async (req, res) => {
  console.log(req.body);
  req.body.fileLink.forEach(async (element) => {
    await Works.create({
      userId: req.body.userId,
      fileLink: element,
    });
  });
  res.send("Done");
});
router.get("/works", async (req, res) => {
  const data = await Works.findAll();
  res.send(data);
});
router.post("/updateuserdata", async (req, res) => {
  let allData = {
    skills: [],
    language: [],
    profession: [],
    knowledge: [],
    medias: [],
  };
  if (req.body.skillList.length !== 0) {
    req.body.skillList.forEach(async (skill, i) => {
      skill.userId = req.body.userId;
      delete skill.id;
      console.log(skill);
      allData.skills[i] = skill;
      await UserSkills.create(skill);
    });
  }
  if (req.body.languageList.length !== 0) {
    req.body.languageList.forEach(async (language, i) => {
      language.userId = req.body.userId;
      delete language.id;
      console.log(language);
      allData.language[i] = language;
      await UserLanguages.create(language);
    });
  }
  if (req.body.professionList.length !== 0) {
    req.body.professionList.forEach(async (profession, i) => {
      profession.userId = req.body.userId;
      delete profession.id;
      console.log(profession);
      allData.profession[i] = profession;
      await UserProfessions.create(profession);
    });
  }
  if (req.body.knowledgeList.length !== 0) {
    req.body.knowledgeList.forEach(async (knowledge, i) => {
      knowledge.userId = req.body.userId;
      delete knowledge.id;
      console.log(knowledge);
      allData.knowledge[i] = knowledge;
      await UserKnowledgeAreas.create(knowledge);
    });
  }
  if (req.body.socialMedias.length !== 0) {
    req.body.socialMedias.forEach(async (medias, i) => {
      medias.userId = req.body.userId;
      delete medias.id;
      console.log(medias);
      allData.medias[i] = medias;
      await UserSocialMedias.create(medias);
    });
  }
  res.json(allData);
});
router.get("/additionalinformation", async (req, res) => {
  const skills = await UserSkills.findAll({
    where: {
      userId: req.query.value,
    },
  });
  const professions = await UserProfessions.findAll({
    where: {
      userId: req.query.value,
    },
  });
  const knowledges = await UserKnowledgeAreas.findAll({
    where: {
      userId: req.query.value,
    },
  });
  const languages = await UserLanguages.findAll({
    where: {
      userId: req.query.value,
    },
  });
  const social = await UserSocialMedias.findAll({
    where: {
      userId: req.query.value,
    },
  });

  const userData = {
    skills: skills,
    professions: professions,
    knowledges: knowledges,
    social: social,
    languages: languages,
  };
  res.json(userData);
});

router.get("/service", async (req, res) => {
  const userData = await Services.findAll();
  res.json(userData);
});
router.post("/service", async (req, res) => {
  const bod = req.body;
  console.log(bod);

  await Services.create(bod);

  res.json(bod);
});
router.get("/serviceRequirement", async (req, res) => {
  const userData = await ServiceRequirements.findAll();
  res.json(userData);
});
router.get("/skills", async (req, res) => {
  let userData = {};
  switch (req.query.value) {
    case "skill":
      userData = await Skills.findAll();
      res.json(userData);
      break;
    case "profession":
      userData = await Professions.findAll();
      res.json(userData);
      break;
    case "knowledge":
      userData = await Knowledge.findAll();
      console.log("nigga please");
      res.json(userData);
      break;
    default:
      break;
  }
  console.log(req.query.value);
});
router.post("/serviceRequirement", async (req, res) => {
  const bod = req.body;
  console.log(bod);
  bod.requirements.forEach(async (element, index) => {
    console.log(element);
    await ServiceRequirements.create(element);
  });

  res.json(bod);
});
router.post("/placeorder", async (req, res) => {
  const bod = req.body;
  const orders = await ServiceOrder.create(bod);
  console.log(bod);
  res.send(orders);
});

router.post("/addrequirementtoorder", async (req, res) => {
  const bod = req.body;
  console.log(bod);
  bod.requirements.forEach(async (element, index) => {
    let newReqObj = {
      orderId: bod.orderId,
      requirement: element.requirement,
      serviceId: element.serviceId,
    };
    console.log(newReqObj);
    await OrderedRequirements.create(newReqObj);
  });
});
router.get("/orders", async (req, res) => {
  const orders = await ServiceOrder.findAll();
  res.send(orders);
});
router.get("/orderrequirements", async (req, res) => {
  const orders = await OrderedRequirements.findAll();
  res.send(orders);
});
router.get("/projects", async (req, res) => {
  const orders = await ServiceOrder.findAll();
  const services = await Services.findAll();
  const users = await Users.findAll();
  res.send({ orders: orders, services: services, users: users });
  console.log("working");
});
router.get("/personalprojects", async (req, res) => {
  const clean = req.query.value.serviceId?.map((item) => {
    return item.slice(2, -1);
  });
  console.log(clean);
  if (clean !== undefined) {
    const orders = await Services.findAll({
      where: { id: clean },
    });
    res.send(orders);
  } else {
    console.log("No Orders yet");
  }
});
router.get("/personalorderrequirements", async (req, res) => {
  console.log("ordreqs", req.query);
  const orders = await OrderedRequirements.findAll({
    where: { orderId: req.query.value?.orderId },
  });
  res.send(orders);
});
router.get("/personalorders", async (req, res) => {
  const orders = await ServiceOrder.findAll({
    where: { userId: req.query.value?.userID },
  });
  res.send(orders);
});

module.exports = router;
