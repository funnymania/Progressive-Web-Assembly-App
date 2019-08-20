Review Notes

Aesthetic

[X] Add a 'How does this work?' link at the top which will explain to the user how this functions (explain bit, capacity generating a queue, etc)

[X] text in each queue entry needs to wrap at some point (~265)
same with the stack (move to queue button should be same size as stack display)

[X] move to queue button should stand out more as a button

[X] space out conflicts and incomplete bett

[X] need a design decision: should New Thing look like The Stack?
(balckbackground on text area and white text, add to queue button visually identical
to move to queue buttton)

[X] new thing text box should at least be taller

[X] spinner needs to work

[X] add a clear everything button

[] clear contents from each queue entry
also expose some 'x' button of sorts to REMOVE a queue item itself
(queue capacity decreases from 4 to 3 for instance on clicking x)

[] adding capacity beyond window width should wrap 
(ideally without bringing up scroll bars)

[] light blue border around queue entries that are incomplete
orange slightly reddish border around queue entries which are conflicts

Code

[X] Remove invisible box code from setUpQueues

[] queues should be linked lists.

[] sorted similarly with empty on the right

[] moveToStack would simply take from front

[] and flip bit

[] queueToStack would not exist, replaced by:

[] moveToStack()

[] addEmptyToEnd(stackToAddTo)


 