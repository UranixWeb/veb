"use client";
import React, { useEffect, useState } from 'react';

const SVGComponent = (props: any) => (
<svg {...props} className='justify-self-center' width="27" height="27" viewBox="0 0 120 30"><circle cx="30" cy="15" r="10" fill="#000000"><animate attributeName="cy" from="15" to="15" dur="0.6666666666666666s" begin="0s" repeatCount="indefinite" values="15;5;15" keyTimes="0;0.5;1"></animate></circle><circle cx="60" cy="15" r="10" fill="#000000"><animate attributeName="cy" from="15" to="15" dur="0.6666666666666666s" begin="0.2s" repeatCount="indefinite" values="15;5;15" keyTimes="0;0.5;1"></animate></circle><circle cx="90" cy="15" r="10" fill="#000000"><animate attributeName="cy" from="15" to="15" dur="0.6666666666666666s" begin="0.4s" repeatCount="indefinite" values="15;5;15" keyTimes="0;0.5;1"></animate></circle></svg>
);

export default function Page() {

  const [status, setStatus] = useState("login")
  const [warning, setWarning] = useState("")
  const [currentUsername, setCurrentUsername] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [currentLevel, setCurrentLevel] = useState("")
  const [newLevel, setNewLevel] = useState("user")
  const [myPassword, setMyPassword] = useState("")
  const [posts, setPosts] = useState([])
  const [vareni, setVareni] = useState([])
  const [checked, setChecked] = useState(Boolean)
  const [doCheck, setDoCheck] = useState(Boolean)
  const [newCheck, setNewCheck] = useState(false)
  const [checkList, setCheckList] = useState([])
  const missingWarning = "Vyplňte prosím všechna pole"
  const wrongWarning = "Špatné jméno nebo heslo"
  const userExistsWarning = "Uživatel s tímto přihlašovacím jménem již existuje"
  const generalWarning = "Nastala nepojmenovatelná chyba znamející jistý konec světa"


//--------------------------------------------// DATABASE FUNKCE //--------------------------------------------//


  function resetUser() {
    setCurrentUsername("")
    setCurrentPassword("")
    setCurrentLevel("")
    setStatus("login")
  }

   useEffect(() => {
    if (status === "main") {
      getPosts();
    } else if (status === "vareni") {
      getVareni();
    } else if (status === "viewCheckList") {
      getCheckList();
    }
  }, [status]);

//---// Funkce pro automatické přihlašování uživatelů //---//

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');

    if (savedUsername && savedPassword) {
      const autoLogin = async () => {

        setWarning("Automatické přihlašování...")

        try {
          const res = await fetch('/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              username: savedUsername, 
              password: savedPassword, 
              action: "login" 
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.username === savedUsername) {
              setCurrentUsername(data.username);
              setCurrentPassword(data.password);
              setCurrentLevel(data.level);
              setChecked(data.checked);
              setDoCheck(data.doCheck);
              setStatus("main");
            }
          }
        } catch (err) {
          console.error("Auto-login failed:", err);
        }
      };
      autoLogin();
    }
  }, []);

//---// Funkce pro přihlašování uživatelů //---//

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setWarning("Počkejte chvíli...")

    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get('username')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const action = "login"

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, action }),
      });

      if (!res.ok) {
        setWarning("Stala se chyba")
      }

      const data = await res.json();
      if (data.username === username) {
        setWarning("")
        setCurrentUsername(data.username)
        setCurrentPassword(data.password)
        setCurrentLevel(data.level)
        setChecked(data.checked)
        setDoCheck(data.doCheck)
        setStatus("main")
        const remember = formData.get('remember') === 'on';
        if (remember) {
          localStorage.setItem('username', data.username);
          localStorage.setItem('password', data.password);
        }
      } else if (data === "missing") {
        setWarning(missingWarning)
      } else {
        setWarning(wrongWarning)
      }

    } catch (err) {
      console.error(err);
    }
  };

//---// Funkce pro přidávání uživatelů //---//

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setWarning("Počkejte chvíli...")

    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get('username')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const level = newLevel;
    const doCheck = newCheck;
    const action = "register"

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, action, level, doCheck }),
      });

      if (!res.ok) {
        setWarning(userExistsWarning)
      }

      const data = await res.json();
      if (data.username === username) {
        setWarning("Uživatel vytvořen: " + data.username)
      } else if (data === "missing") {
        setWarning(missingWarning)
      } else {
        setWarning(userExistsWarning)
      }

    } catch (err) {
      console.error(err);
    }
  };

//---// Funkce pro přidávání článků //---//

  const addPost = async function (e: React.FormEvent<HTMLFormElement>) {
    
    e.preventDefault()
    setWarning("Počkejte chvíli...")

    const form = e.currentTarget;
    const formData = new FormData(form);
    const label = formData.get('label')?.toString() || '';
    const p1 = formData.get('p1')?.toString() || '';
    const p2 = formData.get('p2')?.toString() || '';
    const p3 = formData.get('p3')?.toString() || '';
    const p4 = formData.get('p4')?.toString() || '';
    const p5 = formData.get('p5')?.toString() || '';
    const createdBy = currentUsername;
    const action = "addPost";

      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, p1, p2, p3, p4, p5, createdBy, action }),
      });

      if (!res.ok) {
        setWarning("Stala se chyba")
      }

      const data = await res.json();

      if (data === "done") {
        setWarning("")
        setStatus("main")
      } else if (data === "chyba") {
        setWarning("Nastala chyba")
      } else if (data === "missing") {
        setWarning(missingWarning)
      } else {
        console.log(data)
      }
  };
  
//---// Funkce pro načtení článků //---//

  const getPosts = async function () {
    
    setPosts([])

    const action = "getPosts";

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        setWarning("Stala se chyba")
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      setPosts(data)
      setWarning("")

    } catch (err) {
      console.error(err);
    }
  };

//---// Funkce pro vytváření Vaření //---//

  const addVareni = async function (e: React.FormEvent<HTMLFormElement>) {
    
    e.preventDefault()
    setWarning("Počkejte chvíli...")

    const form = e.currentTarget;
    const formData = new FormData(form);
    const label = formData.get('label')?.toString() || '';
    const vsichni = formData.get('vsichni')?.toString() || '';
    const lisak = formData.get('lisak')?.toString() || '';
    const kroko = formData.get('kroko')?.toString() || '';
    const bidlo = formData.get('bidlo')?.toString() || '';
    const mungo = formData.get('mungo')?.toString() || '';
    const bushman = formData.get('bushman')?.toString() || '';
    const tobias = formData.get('tobias')?.toString() || '';
    const createdBy = currentUsername;
    const action = "addVareni";

    console.log({ label, vsichni, lisak, kroko, bidlo, mungo, bushman, tobias, createdBy, action })

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, vsichni, lisak, kroko, bidlo, mungo, bushman, tobias, createdBy, action }),
      });

      if (!res.ok) {
        setWarning("Stala se chyba")
      }

      const data = await res.json();
      if (data === "done") {
        setWarning("")
        resetUser()
      } else if (data === "chyba") {
        setWarning("Nastala chyba")
      } else if (data === "missing") {
        setWarning(missingWarning)
      } else {
        console.log(data)
      }

    } catch (err) {
      console.error(err);
    }
  };

//---// Funkce pro mazání článků //---//

  const deletePost = async function (id: number) {

    setPosts([])
    const action = "deletePost";

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      if (!res.ok) {
        setWarning("Stala se chyba")
      }

      const data = await res.json();
      if (data === "done") {
        setWarning("Článek smazán")
        getPosts(); 
      } else if (data === "chyba") {
        setWarning("Nastala chyba")
      } else {
        console.log(data)
      }

    } catch (err) {
      console.error(err);
    }
  };

//---// Funkce pro editaci článků //---//

  const editPost = async function (id: number) {
    const postToEdit = posts.find((post: any) => post.id === id);
    if (postToEdit) {setPosts([postToEdit]); setStatus("editPost")} else {setWarning("Nastala chyba")}
  }

//---// Funkce pro aktualizaci článků //---//
  const updatePost = async function (e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setWarning("Počkejte chvíli...")
      const form = e.currentTarget;
      const formData = new FormData(form);
      const label = formData.get('label')?.toString() || '';
      const p1 = formData.get('p1')?.toString() || '';
      const p2 = formData.get('p2')?.toString() || '';
      const p3 = formData.get('p3')?.toString() || '';
      const p4 = formData.get('p4')?.toString() || '';
      const p5 = formData.get('p5')?.toString() || '';
      const id = formData.get('id')?.toString() || '';
      const action = "updatePost";
  
      try {
        const res = await fetch('/api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, label, p1, p2, p3, p4, p5, action }),
        });
  
        if (!res.ok) {
          setWarning("Stala se chyba")
          console.log(res)
        }
  
        const data = await res.json();
        if (data === "done") {
          setWarning("Článek upraven")
          setStatus("main")
        } else if (data === "chyba") {
          setWarning("Nastala chyba")
        } else if (data === "missing") {
          setWarning(missingWarning)
        } else {
          console.error("Update failed:", data)
        }
  

      } catch (err) {
        console.error(err);
      }
  }

//---// Funkce pro načtení Vaření //---//
  const getVareni = async function () {
    setVareni([])
    const action = "getVareni";
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        setWarning("Stala se chyba")
      }

      const data = await res.json();
      setVareni(data)
      setWarning("")
      console.log(vareni)

  }
  catch (err) {
    console.error(err);
  }
}

//---// Funkce pro potvrzení uživatele //---//
  const checkUser = async function () {
    const action = "checkUser";
    const username = currentUsername;
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, username }),
      });
    setChecked(true)
  }
  catch (err) {
    console.error(err);
  }
}

//---// Funkce pro načtení uživatelů co potvrdili rozpis surovin na vaření //---//
  const getCheckList = async function () {
    const action = "getCheckList";
    setCheckList([])
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        setWarning("Stala se chyba")
      }

      const data = await res.json();
      setCheckList(data)
      setWarning("")

    } catch (err) {
      console.error(err);
    }
  }

//--------------------------------------------// PAGE HTML //--------------------------------------------//


//---// Vaření //---//

  if (status === "viewCheckList") {
    const allChecked = checkList.length > 0 && checkList.every((c: any) => c.checked === true);
    return (
      <div id={allChecked ? "login-container-green" : "login-container"}>
        <div className={allChecked ? "vareni-card-green" : "vareni-card"}>
          <h3>Seznam uživatelů, co potvrdili vaření:</h3>
          {checkList.length > 0 ? (
            checkList.map((c: any) => (<div key={c.id}>
              {c.checked === true ? (
                <p id="checked-user-true"><svg id='user-check-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z"/></svg> {c.username}</p>
              ) : (<>
                <p id="checked-user-false"><svg id='user-check-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z"/></svg> {c.username}</p>
              </>)}
            </div>
            ))
          ) : (
            <p>Načítám...</p>
          )}
          <button id="back" onClick={() => {setWarning(""); setStatus("main")}}><svg id="backsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320zM188.7 308.7L292.7 204.7C297.3 200.1 304.2 198.8 310.1 201.2C316 203.6 320 209.5 320 216L320 272L416 272C433.7 272 448 286.3 448 304L448 336C448 353.7 433.7 368 416 368L320 368L320 424C320 430.5 316.1 436.3 310.1 438.8C304.1 441.3 297.2 439.9 292.7 435.3L188.7 331.3C182.5 325.1 182.5 314.9 188.7 308.7z"/></svg></button>
        </div>
      </div>
    )
  } else if (currentLevel === "vareni") {
      return (
        <>
          <form className="vareni-form" onSubmit={addVareni}>
            <h1>Přidat článek: Vaření</h1>
            <label id='label-text' htmlFor='label'>Název: </label><input name='label' id='label' type='text' placeholder='Název' defaultValue={""} autoComplete="off"></input><br></br>
            <label htmlFor='vsichni'>Všichni: </label><input name='vsichni' id='vsichni' type='text' placeholder='Voda, skrabky...'></input>
            <label htmlFor='lisak'>Lišák: </label><input name='lisak' id='lisak' type='text' placeholder='Nejde'></input>
            <label htmlFor='kroko'>Kroko: </label><input name='kroko' id='kroko' type='text' placeholder='Nejde'></input>
            <label htmlFor='bidlo'>Bidlo: </label><input name='bidlo' id='bidlo' type='text' placeholder='Nejde'></input>
            <label htmlFor='mungo'>Mungo: </label><input name='mungo' id='mungo' type='text' placeholder='Nejde'></input>
            <label htmlFor='bushman'>Bushman: </label><input name='bushman' id='bushman' type='text' placeholder='Nejde'></input>
            <label htmlFor='tobias'>Tobiáš: </label><input name='tobias' id='tobias' type='text' placeholder='Nejde'></input>
            {warning}
            <button type='submit'>Přidat Vaření</button>
            <h2>Jste přihlášeni na účet jehož účel je výhradně vytváření seznamů surovin na vaření. Pokud chcete procházet hlavní stránky, přihlaste se na svůj hlavní účet, nebo kontaktujte rádce/podrádce ať vám ho vytvoří.</h2>
          </form>
          <button id="back" onClick={() => {setWarning(""); resetUser()}}><svg id='backsvg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320zM188.7 308.7L292.7 204.7C297.3 200.1 304.2 198.8 310.1 201.2C316 203.6 320 209.5 320 216L320 272L416 272C433.7 272 448 286.3 448 304L448 336C448 353.7 433.7 368 416 368L320 368L320 424C320 430.5 316.1 436.3 310.1 438.8C304.1 441.3 297.2 439.9 292.7 435.3L188.7 331.3C182.5 325.1 182.5 314.9 188.7 308.7z"/></svg></button>
          <button onClick={() => {setStatus("viewCheckList")}} id='add-post'>
            <svg id="backsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M197.8 100.3C208.7 107.9 211.3 122.9 203.7 133.7L147.7 213.7C143.6 219.5 137.2 223.2 130.1 223.8C123 224.4 116 222 111 217L71 177C61.7 167.6 61.7 152.4 71 143C80.3 133.6 95.6 133.7 105 143L124.8 162.8L164.4 106.2C172 95.3 187 92.7 197.8 100.3zM197.8 260.3C208.7 267.9 211.3 282.9 203.7 293.7L147.7 373.7C143.6 379.5 137.2 383.2 130.1 383.8C123 384.4 116 382 111 377L71 337C61.6 327.6 61.6 312.4 71 303.1C80.4 293.8 95.6 293.7 104.9 303.1L124.7 322.9L164.3 266.3C171.9 255.4 186.9 252.8 197.7 260.4zM288 160C288 142.3 302.3 128 320 128L544 128C561.7 128 576 142.3 576 160C576 177.7 561.7 192 544 192L320 192C302.3 192 288 177.7 288 160zM288 320C288 302.3 302.3 288 320 288L544 288C561.7 288 576 302.3 576 320C576 337.7 561.7 352 544 352L320 352C302.3 352 288 337.7 288 320zM224 480C224 462.3 238.3 448 256 448L544 448C561.7 448 576 462.3 576 480C576 497.7 561.7 512 544 512L256 512C238.3 512 224 497.7 224 480zM128 440C150.1 440 168 457.9 168 480C168 502.1 150.1 520 128 520C105.9 520 88 502.1 88 480C88 457.9 105.9 440 128 440z"/></svg>
          </button>
        </>
      )


//---// Hlavní stránka //---//


  } else if (status === "main") {
    return (
      <>
        <div id="main-header">
          <h1>Vlčí web - Veb</h1>
          <div id="gradient"></div>
        </div>
        {doCheck ? (
        <>
        {checked ? (
        <div id='vareni-alert-done'>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/></svg>
            <p>Zde naleznete nejnovější rozpis surovin na vaření:</p>
          </div>
          <button onClick={() => {setStatus("vareni"); getVareni}}>Vaření <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/></svg></button>
        </div>
      ) : (
        <div id='vareni-alert-unchecked'>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z"/></svg>
            <p>Potvrďte prosím nejnovější rozpis surovin na vaření:</p>
          </div>
          <button onClick={() => {setStatus("vareni"); getVareni}}>Vaření <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/></svg></button>
        </div>
      )}
      </>) : (<></>)}
        <div className="posts-container">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <div key={post.id} className="post-card">
                <h3>{post.label}</h3>
                <p>{post.p1}</p>
                {post.p2 && <p>{post.p2}</p>}
                {post.p3 && <p>{post.p3}</p>}
                {post.p4 && <p>{post.p4}</p>}
                {post.p5 && <p>{post.p5}</p>}
                <h4>({new Date(post.createdAt).toLocaleDateString()}, {post.createdBy})</h4>
                { currentLevel === "admin" ? (
                  <div className='admin-buttons'>
                    <button onClick={() => deletePost(post.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg></button>
                    <button onClick={() => editPost(post.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"/></svg></button>
                  </div>
                ) : (<></>)}
              </div>
            ))
          ) : (
            <p>Načítám...</p>
          )}
        </div>
        <div id='userbar'>        {currentLevel === "admin" ? (
          <div id='adminbar'>
            <button onClick={() => {setStatus("register")}} id='adduser'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M280 88C280 57.1 254.9 32 224 32C193.1 32 168 57.1 168 88C168 118.9 193.1 144 224 144C254.9 144 280 118.9 280 88zM304 300.7L341 350.6C353.8 333.1 369.5 317.9 387.3 305.6L331.1 229.9C306 196 266.3 176 224 176C181.7 176 142 196 116.8 229.9L46.3 324.9C35.8 339.1 38.7 359.1 52.9 369.7C67.1 380.3 87.1 377.3 97.7 363.1L144 300.7L144 576C144 593.7 158.3 608 176 608C193.7 608 208 593.7 208 576L208 416C208 407.2 215.2 400 224 400C232.8 400 240 407.2 240 416L240 576C240 593.7 254.3 608 272 608C289.7 608 304 593.7 304 576L304 300.7zM496 608C575.5 608 640 543.5 640 464C640 384.5 575.5 320 496 320C416.5 320 352 384.5 352 464C352 543.5 416.5 608 496 608zM512 400L512 448L560 448C568.8 448 576 455.2 576 464C576 472.8 568.8 480 560 480L512 480L512 528C512 536.8 504.8 544 496 544C487.2 544 480 536.8 480 528L480 480L432 480C423.2 480 416 472.8 416 464C416 455.2 423.2 448 432 448L480 448L480 400C480 391.2 487.2 384 496 384C504.8 384 512 391.2 512 400z"/></svg>
            </button>
            <button onClick={() => {setStatus("addPost")}} id='addpost'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L308 576C285.3 544.5 272 505.8 272 464C272 363.4 349.4 280.8 448 272.7L448 234.6C448 217.6 441.3 201.3 429.3 189.3L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM464 608C543.5 608 608 543.5 608 464C608 384.5 543.5 320 464 320C384.5 320 320 384.5 320 464C320 543.5 384.5 608 464 608zM480 400L480 448L528 448C536.8 448 544 455.2 544 464C544 472.8 536.8 480 528 480L480 480L480 528C480 536.8 472.8 544 464 544C455.2 544 448 536.8 448 528L448 480L400 480C391.2 480 384 472.8 384 464C384 455.2 391.2 448 400 448L448 448L448 400C448 391.2 455.2 384 464 384C472.8 384 480 391.2 480 400z"/></svg>
            </button>
          </div>) : (<></>)}
        {currentUsername === "" ? (
          <button onClick={() => {setStatus("login")}}>Přihlásit se</button>
          ) : (
          <div id='logged'>
            <svg id='user' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M463 448.2C440.9 409.8 399.4 384 352 384L288 384C240.6 384 199.1 409.8 177 448.2C212.2 487.4 263.2 512 320 512C376.8 512 427.8 487.3 463 448.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 336C359.8 336 392 303.8 392 264C392 224.2 359.8 192 320 192C280.2 192 248 224.2 248 264C248 303.8 280.2 336 320 336z"/></svg>
            {currentLevel === "admin" ? (<>Administrátor: </>) : (<>Uživatel: </>)}{currentUsername}<br></br>
            <button id='logout' onClick={resetUser}>Odhlásit se</button>
          </div>
          )}
          </div>
      </>
    )


//---// Přihlášení //---//


  } else if (status === "login") {
    return (
      <div id="login-container">
        <form id="formlogin" onSubmit={handleLogin}>
          <h1>Přihlášení</h1>
          <label htmlFor='username'>Přihlašovací jméno: </label><input name='username' id='username' type='text' placeholder='Byzon'></input>
          <label htmlFor='password'>Heslo: </label><input name='password' id='password' type='password' placeholder='M4mR4dP4lc3'></input>
          <label htmlFor='remember'><input type='checkbox' id='remember' name='remember'></input> Pamatuj si mě</label>
          <div id="warning">{warning}</div>
          <button type='submit' id='submit'><p>{warning !== "Počkejte chvíli..." ? (<>{warning !== "Automatické přihlašování..." ? (<>Přihlásit se</>) : (<SVGComponent/>)}</>) : (<SVGComponent/>)}</p></button>
        </form>
      </div>
    )


//---// Registrace a přidávání článků (admin) //---//


  } else if (status === "register") {
    return (
      <>
        <form id="formregister" onSubmit={handleRegister}>
          <h1>Vytvoření nového uživatele</h1>
          <label htmlFor='username'>Přihlašovací jméno: </label><input name='username' id='username' type='text' placeholder='Přihlašovací jméno'></input>
          <label htmlFor='password'>Heslo: </label><input name='password' id='password' type='password' placeholder='Heslo'></input>
          <label htmlFor='doCheck'>
            <input
              type="checkbox"
              id='doCheck'
              name='doCheck'
              checked={newCheck}
              onChange={(e) => setNewCheck(e.target.checked)}
            />
            &nbsp; Uživatel bude mít přístup k vaření
          </label>
          <label htmlFor='level'>Úroveň přístupu: </label>
          <select id='level' onChange={(e) => {setNewLevel(e.target.value)}}><option value={"user"}>Uživatel</option><option value={"admin"}>Administrátor</option></select>{newLevel === "admin" ? (<span id='warning'></span>) : (<></>)}
          <div id="warning">{warning}</div>
          {newLevel === "admin" ? (
            <>
              <p>Nový uživatel bude administrátor, vyplňte vaše heslo pro ověření identity:</p>
              <input onChange={(e) => {setMyPassword(e.target.value)}}></input>
              {myPassword === currentPassword ? (<button type='submit'>Registrovat uživatele</button>) : (<button disabled>Špatné heslo</button>)}
            </>
          ) : (<button type='submit'>Registrovat uživatele</button>)}
        <button id="back" onClick={() => {setStatus("main"); setWarning(""); setNewLevel("user")}}><svg id="backsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320zM188.7 308.7L292.7 204.7C297.3 200.1 304.2 198.8 310.1 201.2C316 203.6 320 209.5 320 216L320 272L416 272C433.7 272 448 286.3 448 304L448 336C448 353.7 433.7 368 416 368L320 368L320 424C320 430.5 316.1 436.3 310.1 438.8C304.1 441.3 297.2 439.9 292.7 435.3L188.7 331.3C182.5 325.1 182.5 314.9 188.7 308.7z"/></svg></button>
        </form>
      </>
    )


//---// Přidávání článků //---//


  } else if (status === "addPost") {
    return (
      <>
        <form id="formpost" onSubmit={addPost}>
          <h1>Přidat článek:</h1>
          <input name='label' id='label' type='text' placeholder='Název'></input>
          <input name='p1' id='p1' type='text' placeholder='Odstavec1 (povinný)'></input>
          <input name='p2' id='p2' type='text' placeholder='Odstavec2'></input>
          <input name='p3' id='p3' type='text' placeholder='Odstavec3'></input>
          <input name='p4' id='p4' type='text' placeholder='Odstavec4'></input>
          <input name='p5' id='p5' type='text' placeholder='Odstavec5'></input>
          {warning}
          <button type='submit'>Přidat článek</button>
        <button id="back" onClick={() => {setWarning(""); setStatus("main")}}><svg id="backsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320zM188.7 308.7L292.7 204.7C297.3 200.1 304.2 198.8 310.1 201.2C316 203.6 320 209.5 320 216L320 272L416 272C433.7 272 448 286.3 448 304L448 336C448 353.7 433.7 368 416 368L320 368L320 424C320 430.5 316.1 436.3 310.1 438.8C304.1 441.3 297.2 439.9 292.7 435.3L188.7 331.3C182.5 325.1 182.5 314.9 188.7 308.7z"/></svg></button>
        </form>
      </>
    )
  } else if (status === "editPost") {
    return (
      <>
      {posts.map((post: any) => {
          return (
            <form id="formpost" onSubmit={updatePost} key={post.id}>
              <h1>Upravit článek: {post.label}</h1>
              <input name='label' id='label' type='text' placeholder='Název' defaultValue={post.label}></input>
              <input name='p1' id='p1' type='text' placeholder='Odstavec1 (povinný)' defaultValue={post.p1}></input>
              <input name='p2' id='p2' type='text' placeholder='Odstavec2' defaultValue={post.p2}></input>
              <input name='p3' id='p3' type='text' placeholder='Odstavec3' defaultValue={post.p3}></input>
              <input name='p4' id='p4' type='text' placeholder='Odstavec4' defaultValue={post.p4}></input>
              <input name='p5' id='p5' type='text' placeholder='Odstavec5' defaultValue={post.p5}></input>
              <input name='id' id='id' type='hidden' defaultValue={post.id}></input>
              {warning}
              <button id="back" onClick={() => {setWarning(""); setStatus("main")}}><svg id="backsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320zM188.7 308.7L292.7 204.7C297.3 200.1 304.2 198.8 310.1 201.2C316 203.6 320 209.5 320 216L320 272L416 272C433.7 272 448 286.3 448 304L448 336C448 353.7 433.7 368 416 368L320 368L320 424C320 430.5 316.1 436.3 310.1 438.8C304.1 441.3 297.2 439.9 292.7 435.3L188.7 331.3C182.5 325.1 182.5 314.9 188.7 308.7z"/></svg></button>
              <button type='submit'>Upravit článek</button>
            </form>
          )
      })}
    </>)
  } else if (status === "vareni") {
    return (
      <>{checked ? (
      <div id="login-container">
        {vareni.length > 0 ? (
          vareni.map((v: any) => (
            <div key={v.id} className="vareni-card">
              <h3>{v.label}</h3>
              <p><b>Všichni:</b> {v.vsichni !== "" ? v.vsichni : "Nic"}</p>
              <p><b>Lišák:</b> {v.lisak !== "" ? v.lisak : "Nejde"}</p>
              <p><b>Kroko:</b> {v.kroko !== "" ? v.kroko : "Nejde"}</p>
              <p><b>Bidlo:</b> {v.bidlo !== "" ? v.bidlo : "Nejde"}</p>
              <p><b>Mungo:</b> {v.mungo !== "" ? v.mungo : "Nejde"}</p>
              <p><b>Bushman:</b> {v.bushman !== "" ? v.bushman : "Nejde"}</p>
              <p><b>Tobiáš:</b> {v.tobias !== "" ? v.tobias : "Nejde"}</p>
              <h4>({new Date(v.createdAt).toLocaleDateString()})</h4>
              <button id='checked-button' disabled>Potvrzeno</button>
              <button id="back" onClick={() => {setWarning(""); setStatus("main")}}><svg id="backsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320zM188.7 308.7L292.7 204.7C297.3 200.1 304.2 198.8 310.1 201.2C316 203.6 320 209.5 320 216L320 272L416 272C433.7 272 448 286.3 448 304L448 336C448 353.7 433.7 368 416 368L320 368L320 424C320 430.5 316.1 436.3 310.1 438.8C304.1 441.3 297.2 439.9 292.7 435.3L188.7 331.3C182.5 325.1 182.5 314.9 188.7 308.7z"/></svg></button>
            </div>
          ))
        ) : (
          <p>Načítám...</p>
        )}
        <button id="back" onClick={() => {setWarning(""); resetUser()}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320zM188.7 308.7L292.7 204.7C297.3 200.1 304.2 198.8 310.1 201.2C316 203.6 320 209.5 320 216L320 272L416 272C433.7 272 448 286.3 448 304L448 336C448 353.7 433.7 368 416 368L320 368L320 424C320 430.5 316.1 436.3 310.1 438.8C304.1 441.3 297.2 439.9 292.7 435.3L188.7 331.3C182.5 325.1 182.5 314.9 188.7 308.7z"/></svg></button>
      </div>) : (


      <div id="login-container-yellow">
        {vareni.length > 0 ? (
          vareni.map((v: any) => (
            <div key={v.id} className="vareni-card-yellow">
              <h3>{v.label}</h3>
              <p><b>Všichni:</b> {v.vsichni !== "" ? v.vsichni : "Nic"}</p>
              <p><b>Lišák:</b> {v.lisak !== "" ? v.lisak : "Nejde"}</p>
              <p><b>Kroko:</b> {v.kroko !== "" ? v.kroko : "Nejde"}</p>
              <p><b>Bidlo:</b> {v.bidlo !== "" ? v.bidlo : "Nejde"}</p>
              <p><b>Mungo:</b> {v.mungo !== "" ? v.mungo : "Nejde"}</p>
              <p><b>Bushman:</b> {v.bushman !== "" ? v.bushman : "Nejde"}</p>
              <p><b>Tobiáš:</b> {v.tobias !== "" ? v.tobias : "Nejde"}</p>
              <h4>({new Date(v.createdAt).toLocaleDateString()})</h4>
              <button id='check-button' onClick={checkUser}>Potvrdit</button>
              <button id="back" onClick={() => {setWarning(""); setStatus("main")}}><svg id="backsvg-yellow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320zM188.7 308.7L292.7 204.7C297.3 200.1 304.2 198.8 310.1 201.2C316 203.6 320 209.5 320 216L320 272L416 272C433.7 272 448 286.3 448 304L448 336C448 353.7 433.7 368 416 368L320 368L320 424C320 430.5 316.1 436.3 310.1 438.8C304.1 441.3 297.2 439.9 292.7 435.3L188.7 331.3C182.5 325.1 182.5 314.9 188.7 308.7z"/></svg></button>
            </div>
          ))
        ) : (
          <p>Načítám...</p>
        )}
        <button id="back" onClick={() => {setWarning(""); resetUser()}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320zM188.7 308.7L292.7 204.7C297.3 200.1 304.2 198.8 310.1 201.2C316 203.6 320 209.5 320 216L320 272L416 272C433.7 272 448 286.3 448 304L448 336C448 353.7 433.7 368 416 368L320 368L320 424C320 430.5 316.1 436.3 310.1 438.8C304.1 441.3 297.2 439.9 292.7 435.3L188.7 331.3C182.5 325.1 182.5 314.9 188.7 308.7z"/></svg></button>
      </div>)}
      </>
    )
  }

}