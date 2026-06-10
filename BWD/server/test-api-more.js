(async ()=>{
  const base='http://localhost:3000';
  const uid='test-api-uid-2026';
  const displayName='Test User';
  try{
    console.log('-- POST /api/points');
    let r = await fetch(base+'/api/points', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({uid, displayName, amount:10, reason:'integration-test'})});
    console.log('points status', r.status, await r.text());

    console.log('\n-- GET /api/leaderboard?limit=5');
    r = await fetch(base+'/api/leaderboard?limit=5');
    console.log('leaderboard status', r.status);
    console.log(await r.text());

    console.log('\n-- POST /api/checkins');
    r = await fetch(base+'/api/checkins', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({placeId:'place-123', placeName:'Test Place', uid, displayName})});
    console.log('checkins status', r.status, await r.text());

    console.log('\n-- POST /api/stories');
    r = await fetch(base+'/api/stories', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({title:'Test story', content:'This is a test story', place:'Da Nang', tags:['test'], authorName:displayName, authorUid:uid, initials:'TU'})});
    const postStory = await r.json().catch(()=>null);
    console.log('stories POST status', r.status, postStory);
    const storyId = postStory?.id;

    if (storyId) {
      console.log('\n-- POST /api/stories/'+storyId+'/like');
      r = await fetch(base+`/api/stories/${storyId}/like`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({uid})});
      console.log('like status', r.status, await r.text());
    }

    console.log('\n-- GET /api/stories?limit=5');
    r = await fetch(base+'/api/stories?limit=5');
    console.log('stories GET status', r.status);
    console.log(await r.text());

    console.log('\n-- GET /api/projects');
    r = await fetch(base+'/api/projects');
    const projects = await r.json().catch(()=>[]);
    console.log('projects', projects.length);
    if (projects.length>0) {
      const pid = projects[0].id || projects[0].projectId || projects[0].name || projects[0].id;
      console.log('Attempting donation to project id:', pid);
      r = await fetch(base+'/api/donations', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({projectId:pid, amount:100, uid, displayName})});
      console.log('donation status', r.status, await r.text());
    } else console.log('No projects found, skipping donations');

    console.log('\n-- GET /api/stats');
    r = await fetch(base+'/api/stats');
    console.log('stats status', r.status, await r.text());

  }catch(e){ console.error('ERR', e); }
})();