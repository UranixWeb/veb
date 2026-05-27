/* eslint-disable  @typescript-eslint/no-unused-vars */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { error } from 'console'

export async function POST(req: Request) {
    const body = await req.json()
    const { id, username, password, level, action, label, p1, p2, p3, p4, p5, createdBy, vsichni, lisak, kroko, bidlo, mungo, bushman, tobias, doCheck } = body
  
  
  if (action === "login") {
    try { 
    if (!username || !password) {
      return NextResponse.json("missing")
    }
    
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    })
    if (user === null) {
      return NextResponse.json("")
    } else {
    if (user.password === password) {
    return NextResponse.json(user, { status: 201 })
  } else {
    return NextResponse.json({ error: "Špatné jméno nebo heslo"}, { status: 400})
  }}
  } catch {
    console.error(error)
    return NextResponse.json({ error: "Nesprávné jméno nebo heslo"}, { status: 400})
  }



  } else if (action === "addPost") {
    if (!label || !p1 || !createdBy) {
      return NextResponse.json("missing")
    }
    const post = await prisma.post.create({
      data: {
        label: label,
        p1: p1,
        createdBy: createdBy,
      },
    })
    if (post !== undefined && post !== null) {
      return NextResponse.json("done")
    }

  } else if (action === "register") {
    try { 
    if (!username || !password) {
      return NextResponse.json("missing")
    }
    
    const user = await prisma.user.create({
      data: {
        username: username,
        password: password,
        level: level,
        doCheck: doCheck,
        checked: false,
      },
    })

  if (user !== undefined) {
    return NextResponse.json(user, { status: 201 })
  } else {
    return NextResponse.json({ error: "Špatné jméno nebo heslo"}, { status: 400})
  }
  } catch {
    console.error(error)
    return NextResponse.json({ error: "Nesprávné jméno nebo heslo"}, { status: 400})
  }



  } else if (action === "addVareni") {
    if (!label || (!lisak && !kroko && !bidlo && !mungo && !bushman && !tobias)) {
      return NextResponse.json("missing")
    } else {
      const vareni = await prisma.vareni.update({
        where: { id: 1 },
        data: {
          label: label,
          vsichni: vsichni,
          lisak: lisak,
          kroko: kroko,
          bidlo: bidlo,
          mungo: mungo,
          bushman: bushman,
          tobias: tobias,
          createdBy: createdBy,
        }
      })

      const check = await prisma.user.updateMany({
        data: {
          checked: false
        }
      })

      if (vareni !== null && vareni !== undefined) {
        return NextResponse.json("done")
      } else {
        return NextResponse.json("chyba")
      }
    }
  } else if (action === "getPosts") {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })
    return NextResponse.json(posts)
  } else if (action === "deletePost") {
    if (!id) {
      return NextResponse.json("missing")
    }
    const post = await prisma.post.delete({
      where: {
        id: id
      }
    })
    return NextResponse.json("done")
  } else if (action === "getVareni") {
    const vareni = await prisma.vareni.findMany({})
    return NextResponse.json(vareni)
  } else if (action === "checkUser") {
    if (!username) {
      return NextResponse.json("missing")
    }
    const user = await prisma.user.update({
      where: {
        username: username
      },
      data: {
        checked: true
      }
    })
    return NextResponse.json("done")
  } else if (action === "updatePost") {
    if (!id || !label || !p1) {
      return NextResponse.json("missing")
    }
    try {
    const post = await prisma.post.update({
      where: {
        id: Number(id)
      },
      data: {
        label: label,
        p1: p1,
        p2: p2,
        p3: p3,
        p4: p4,
        p5: p5
      }
    })
    return NextResponse.json("done")
  } catch (error) {
    console.error(error)
    return NextResponse.json("chyba")
  }
  } else if (action === "getCheckList") {
    const users = await prisma.user.findMany({
      where: {
        doCheck: true
      }
    })
    return NextResponse.json(users)
  }
}
