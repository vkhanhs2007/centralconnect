(async ()=>{
  const base='http://localhost:3000';
  const payload={
    uid:'test-api-uid-2026',
    email:'test@example.com',
    displayName:'Test User',
    initials:'TU',
    points:123,
    prefs:[],
    fromLocation:'Da Nang',
    phone:'0123456789',
    provider:'email',
    photoURL:'http://example.com/a.png'
  };
  try{
    const p = await fetch(base+'/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    console.log('POST status',p.status);
    const g = await fetch(base+'/api/users/'+encodeURIComponent(payload.uid));
    console.log('GET status',g.status);
    const data = await g.json();
    console.log('USER', JSON.stringify(data,null,2));
  }catch(e){console.error('ERR',e)}
})();
