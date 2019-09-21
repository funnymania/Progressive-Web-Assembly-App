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

Marketing
- [ ] attract more users via dev.to, hackernews... ig?

Design
- [X] Design Overhaul: capcity no longer refers to boxNumber. Capacity refers to maximum processes alllowed. Consequentially, we are no longer using emptyText to define a boxes empty state. Boxes can only grow to '5', as we are only allowing 5 processes.  
- [X] Placeholder / graphic backing for an empty stack and queue
- [ ] Processes can be grouped together by drag and drop. The behavior of queue-to-stack remains the same.  
- [X] NewThing clears contents on 'Add'
- [ ] implement new page design 
- [ ] add about link to call ghost with card saying 'Simple apps and warts by michael d. mCclure' (twitter link)
- [ ] Small version of logo in footer which links to home.
- [ ] on lowering capcity, which will be via + and - buttons, capcity cannot be lowered unless there is something empty in the queue. 
- [ ] Offline data flow. ontimeout => 'You are Working Offline.' @ topright onclick="Changes will not be saved until we are connected"
- [ ] might need to set character limit on textarea?
- [ ] better launcher flow for pwa on native, when screen opens, it just shows the icon + black screen + Text 'Ghosts'
- [ ] Stack: colorcode stack with incomplete / conflicts state
- [X] Limit capacity from 3 - 5
- [ ] Stylize scrollbar on explanationbox and queue items
- [ ] Plasma lamp inside spinner
- [ ] spinner timing is off, arrows don't look correct
- [ ] queue entry should not grow completely freely (will take up most of screen if other entries are empty
- [ ] Queue item will now contain an array of tasks. When the item is selected for the stack, the first task in tasks will be sent to the stack. the project of this task will remain in the queue, the task will be in the stack, and not removed but highlighted in the queue by "pulsing" a background color in and out (kinda like cursor in vim). popping the stack when it contains a task will mark the task in the queue as complete by coloring the text grey-green and placing in front of the task a green circle with a white check mark inside it.
- [X] Add 'Why' explanation url for why this only provides limited options
- [ ] black fade out when modal for Sharing stack and help explanations pop up
- [ ] Stack: bubble choice should align with state of task in stack
- [X] Stack: should not be allowed to move incomplete back to stack

Code
- [ ] Push updates to user from PWA
- [ ] Remove size change option (handle at bottom right corner) on New Thing text box
- [ ] Read from localStorage to save values, not the backingData. 
- [ ] share-url-box should be a general box for pop-up dialogs
- [ ] scss for setting variables (like background-color = black, etc)
- [ ] create swap partition in localcache for stack in case one is working offline (prob thru service worker)
- [ ] if offline, periodically run heartbeats to server. on reconnect, flip offline, persist data. 
- [ ] validate on the backend
- [ ] sql inject protect

Cloud
- [ ] vue apps should not need to be shipped from our backend. They should be shipped in something like S3
- [ ] need some kind of metrics (like, req/s, time for serving when req received)
- [ ] Run QA on This When Done
