const session = require("express-session");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const path = require("node:path");
const multer = require("multer");
const express = require("express");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = 'https://atrwjfrhhwucoqbilcfn.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(express.urlencoded({ extended: true }));

async function usercheck(email) {
  const user = await prisma.members.findUnique({
    where: { email: email },
  });
  return user;
}

async function idcheck(id) {
  const user = await prisma.members.findUnique({
    where: { id: id },
  });
  return user;
}

async function createuser(username, email, password) {
  try {
    const user = await prisma.members.create({
      data: { username, email, password },
    });
    
    return user;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
}

async function saveuploadedpath(path, filename) {
  await prisma.file.create({
    data: { path: path, filename: filename },
  });
}

async function savecreatedfolder(foldername, folderpath) {
  await prisma.folders.create({
    data: { folderpath: folderpath, foldername: foldername },
  });
}

async function listfolder(path) {
  const escapedPath = path.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = `^${escapedPath}/[^/]+/?$`;
  const folders = await prisma.$queryRawUnsafe(
    `
      SELECT * FROM "folders"
      WHERE "folderpath" ~ $1
    `,
    regex 
  );
  return folders;
}

async function listfile(path) {
  const escapedPath = path.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = `^${escapedPath}/[^/]+/?$`;
  const file = await prisma.$queryRawUnsafe(
    `
      SELECT * FROM "file"
      WHERE "path" ~ $1
    `,
    regex 
  );
  return file;
}






passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await usercheck(email);
        if (!user) {
          return done(null, false, { message: "email doesnt exists" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "wrong password entered" });
        }
        return done(null, user);
      } catch (error) {
        done(error);
        
      }
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await idcheck(id);
    if (!user) {

      return done(null, false);
    }
    return done(null, user);
  } catch (e) {

    return done(e);
  }
});



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    secret: "honeymeep",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
        sessionModelName: 'session',
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/signup", async (req, res) => {
  res.render("signup");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/home{/*path}", upload.single("upl"), async (req, res) => {
     let paths, redirect;
   if (!req.params.path) {paths = req.user.email + '/' + 'home/'+ req.file.originalname
    redirect = 'home/'
   } else {
    paths = req.user.email + (req.params.path == [ '', 'home' ] ? req.params.path.join('/') : `/home/${req.params.path.join('/')}`) + "/" + req.file.originalname;
    redirect = (req.params.path == [ '', 'home' ] ? req.params.path.join('/') : `/home/${req.params.path.join('/')}`)
   }
  
  const filename = req.file.originalname;
  

  const { data, error } = await supabase.storage
    .from("files")
    .upload(paths, req.file.buffer);

  await saveuploadedpath(paths, filename);
  res.redirect(redirect);
});

app.post(
  "/signup",
  [
    body("confirmpass").custom((value, { req }) => {
      if (req.body.password !== value) {
        throw new Error("Password Does not match");
      }
      return true;
    }),
    body("email").custom(async (value) => {
      const user = await usercheck(value);
      if (user) {
        throw new Error("User already exists ");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const erro = validationResult(req);
    if (!erro.isEmpty()) {
      return res.status(400).render("signup", { error: erro.array() });
    }
    try {
      await createuser(req.body.username, req.body.email, req.body.password);
      return res.render("index");
    } catch (err) {
      console.error("Signup failed:", err);
      return res.status(500).send("Signup failed");
      
    }
  }
);

app.post(
  "/login",
  passport.authenticate("local", { successRedirect: "/home" })
);

app.post("/create/*path", async (req, res) => {
  const foldername = req.body.fn;
  const folderPath = `${req.user.email}/${req.params.path.join('/')}/${foldername}`;
  const backPath = `${req.user.email}/${req.params.path.join('/')}/`
 const redirect = req.params.path.join('/')

  try {
    await savecreatedfolder(foldername, folderPath);
  } catch (e) {

  }
  res.redirect(`/${redirect}`);
});

app.get("/home{/*path}", async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send("User not authenticated");
    }

    const path = req.user.email + "/home" + (req.params.path ? "/" + req.params.path.join('/') : "");
    const currentPath = "/home" + (req.params.path ? "/" + req.params.path.join("/") : "");

    const parts = currentPath.split("/").filter(Boolean); // Removes empty strings

let backpath;
if (parts.length <= 1) {
  backpath = "/home";
} else {
  backpath = "/" + parts.slice(0, parts.length - 1).join("/");
  
}   
const listPath = path.endsWith('/') ? path : path + '/';
    const { data, error } = await supabase.storage.from('files');
    if (error) {
      return res.status(500).send("Error fetching files.");
    }
    let folders = [];

      folders = await listfolder(path);
   


    let file = [];

      file = await listfile(path);
    


    res.render("home", { data: data || [], user: req.user, currentPath, backpath, file: file || [], folders: folders || [] });
  } catch (err) {
   
    res.status(500).send('Internal server error');
  }
});

app.get("/download/*path", async (req, res) => {
  const path = req.params.path.join('/');
  console.log(path)
  const redirect = 'https://atrwjfrhhwucoqbilcfn.supabase.co/storage/v1/object/public/files/' + path;
  res.redirect(redirect)

res.send(data);
});

app.listen(4032, () => {
  console.log(4000);
}).on('error', (err)=>{
    console.error('error', err.message)
});
