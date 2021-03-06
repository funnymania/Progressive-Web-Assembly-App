term atlas: { N } = New Thing Box, { emer } = emergency task

Fixes
- [X] saveYourStack: saving stack on changes should only occur when logged in  
- [X] test stack load flow  
- [X] 'Conflicts' does not (visibally?) move to queue from stack
      Instead, when cycling, 'I am empty' moves to stack. 
      Popping 'I am empty' does nothing 
- [X] ExplainationBox: Click outside to hide\
- [X] capacity should be displaying current capacity\
- [X] do not store hardcoded urls in db, only store the unique UUID,
use application code to piece together where the user should go
- [X] Sessions will persist until they are cleared by cronjob. On Log-in, if we do NOT have the session cookie, we must create a new session. initially, we will allow countless sessions. But in the NEXT update, we will only allow one session per device. 
- [X] callGhost: text of button changes on click to non-logged in  
- [X] Toast is only being called once...

Security
- [X] sql inject protect

Mobile Render
- [X] clear extra space to right of app
- [X] text size is too small
- [X] New Thing: placeholder size, capacity size
- [X] needs to be scroll bar on qeueue entry. rest of page needs to conform to flex wrap. 
- [X] login button obscures move to qeueu when stack too large
- [X] render ghost entry: Ghost + card should be bigger on mobile. Sign up button is obscured by ghost. 
- [X] render ghost entry: desktop - card is too wide (ghost is perfect)
- [X] maximum processes allowed bug on visiting shared stack
- [X] when 'desktop site' unchecked looks blown up
- [X] Mobile: New Thing should be below Stack
- [X] Mobile: Ghost does not appear in center of screen
- [X] Mobile: Ghost overflows screen. Fields overflow card. Buttons hidden by gigantic ghost.
- [X] Mobile: The Game box is too large
- [X] pwa looks blown up

Import 2am WASM
- [ ] Correct rendering of credits + lines on startmenu. Do not worry about player movements. 
- [ ] UI Element saying 'Player movements coming soon' in game
- [ ] playable unity->wasm in browser, reference Builds/
- [ ] playable unity->wasm in PWA

New Page Design
- [ ] implement new page design 
- [ ] add about link to call ghost with card saying 'Simple apps and warts by michael d. mCclure' (twitter link)
- [ ] Small version of logo in footer which links to home.

Grouping
- [X] finish mobile render
- [ ] Processes/Projects can be grouped together by drag and drop. The behavior of queue-to-stack remains the same.  

Little Fixes
- [ ] might need to set character limit on textarea?
- [ ] Stylize scrollbar on explanationbox and queue items
- [ ] Stack: colorcode stack with incomplete / conflicts state
- [ ] Plasma lamp inside spinner (can change this on every update)
- [ ] spinner timing is off, arrows don't look correct
- [ ] black fade out when modal for Sharing stack and help explanations pop up
- [ ] Stack: bubble choice should align with state of task in stack
- [ ] Remove size change option (handle at bottom right corner) on New Thing text box
- [ ] ghostentry: better validation on email
- [ ] ShareYourStack should cache stack_url if already requested. 
- [ ] ShareYourStack: If we are looking at a SHARED stack, url should be cache in similar manner.

Tasks
- [ ] Queue item will now contain an array of tasks. When the item is selected for the stack, the first task in tasks will be sent to the stack. the project of this task will remain in the queue, the task will be in the stack, and not removed but highlighted in the queue by "pulsing" a background color in and out (kinda like cursor in vim). popping the stack when it contains a task will mark the task in the queue as complete by coloring the text grey-green and placing in front of the task a green circle with a white check mark inside it.
- [ ] Tasks can be dragged off the queue into N

Marketing
- [ ] attract more users via dev.to, hackernews... ig?

Cloud
- [ ] need some kind of metrics (like, req/s, time for serving when req received)

PWA / Offline Data
- [ ] Read from localStorage to save values, not the backingData. 
- [ ] Offline data flow. ontimeout => 'You are Working Offline.' @ topright onclick="Changes will not be saved until we are connected"
- [ ] Push updates to user from PWA
- [ ] if offline, periodically run heartbeats to server. on reconnect, flip offline, persist data. 
- [ ] create swap partition in localcache for stack in case one is working offline (prob thru service worker)

Dev Improvements
- [ ] share-url-box should be a general box for pop-up dialogs
- [ ] scss for setting variables (like background-color = black, etc)

Design
- [X] Design Overhaul: capcity no longer refers to boxNumber. Capacity refers to maximum processes alllowed. Consequentially, we are no longer using emptyText to define a boxes empty state. Boxes can only grow to '5', as we are only allowing 5 processes.  
- [X] Placeholder / graphic backing for an empty stack and queue
- [X] NewThing clears contents on 'Add'
- [X] Limit capacity from 3 - 5
- [X] Add 'Why' explanation url for why this only provides limited options
- [X] Stack: should not be allowed to move incomplete back to stack


