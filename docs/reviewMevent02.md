[] - END MAIM: Ultimately transitioning to work on native ghost hub applications for mobile. (which is like directory for friends' warts)

Fixes
[X] - saveYourStack: saving stack on changes should only occur when logged in 
[X] - test stack load flow 
[] - 'Conflicts' does not (visibally?) move to queue from stack
      Instead, when cycling, 'I am empty' moves to stack. 
      Popping 'I am empty' does nothing
[] - ExplainationBox: Click outside to hide
[] - capacity should be displaying current capacity
[] - do not store hardcoded urls in db, only store the unique UUID,
use application code to piece together where the user should go
[] - Sessions will persist until they are cleared by cronjob. 
    On Log-in, if we do NOT have the session cookie, we must create 
    a new session. initially, we will allow countless sessions. 
    But in the NEXT update, we will only allow one session per device. 

Marketing
[] - attract more users via dev.to, hackernews... ig?

Design
[] - New Thing clears contents on 'Add'
[] - Remove squares / vue logo thing (replace with global logo.)
[] - Need a global logo / something to click back to home
[] - black fade out when modal for Sharing stack and help explanations pop up
[] - New Thing text box needs sleeker styling
[] - Add 'Why' explanation url for why this only provides limited options
[] - 'You are Working Offline.' onclick="changes will not be persisted until we are connected"
[] - Limit capacity from 3 - 5
[] - Stylize scrollbar on explanationbox
[] - Stylize scrollbars an queue items
[] - Plasma lamp inside spinner
[] - spinner timing is off, arrows don't look correct
[] on lowering capcity, which will be via + and - buttons, capcity cannot be lowered unless there is something empty in the queue. 
[] - queue entry should not grow completely freely (will take up most of screen if other entries are empty
[] - might need to set character limit on textarea?
[]- better launcher flow for pwa on native
[] - Stack: colorcode stack with incomplete / conflicts state
[] - Stack: bubble choice should align with state of task in stack
[X] - Stack: should not be allowed to move incomplete back to stack
[] - Howdoesthiswork, cantdothat: Click outside modals should hide them


Code
[] - Push updates to user from PWA
[] - Read from localStorage to save values, not the backingData. 
[] - share-url-box should be a general box for pop-up dialogs
[] - scss for setting variables (like background-color = black, etc)
[]- create swap partition in localcache for stack in case one is working offline (prob thru service worker)
[] - if offline, periodically run heartbeats to server. on reconnect, flip offline, persist data. 

Cloud
[] - vue apps should not need to be shipped from our backend. They should be shipped in something like S3
[] - need some kind of metrics (like, req/s, time for serving when req received)

[] - Run QA on This When Done
