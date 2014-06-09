
Choose your own collection.

Do you need to look up values by a corresponding key? (maps)
    Do you want entries to be automatically evicted if the collection gets too
    big?
        Is it better to forget an entry if it wasn't used recently, or hasn't
        been used frequently?
            Frequency: LfuMap
            Recency: LruMap
    No, I will manage the content myself thankyouverymuch.
        Will the values always be another particular kind of collection?
            MultiMap
        No, the values might be anything.
            Will the keys always be strings?
                Do you really want to use an Object?
                    See Appendix Z
                No, I would actually like to use a collection.
                    Dict
            The keys might not be strings.
                Will you ever need to iterate?
                    Will the keys be stored in sorted order?
                        Is the collection going to get really big?
                            SortedMap
                        No, it'll be quite managable.
                            SortedArrayMap
                    No, any order will suffice.
                        Map
                No, iteration is overrated.
                    Will the keys always be objects?
                        WeakMap. See Appendix W
                    No, the keys might be values like strings or numbers.
                        Will the keys always be numbers?
                            Object
                        Any kind of key is possible, even a mix of types.
                            FastMap
So you just need a collection of values.
    Are you only interested in unique values? (sets)
        Do you want values to be automatically evicted if the set gets too big.
            Is it better to forget a value if it wasn't used recently, or wasn't
            used frequently?
                Frequncy: LruSet
                Recency: LruSet
        No, I will manage the values myself, kthnxbai.
            Will you ever need to iterate?
                Do the values need to be stored in sorted order?
                    Will the set get really big, like more than 100 values?
                        SortedSet
                    No, the size is managable.
                        SortedArraySet
                No, any order will suffice.
                    Set
            No, iteration is overrated.
                FastSet
    You want all values, and there may be duplicates.
        Are you interested in keeping track of which value is the largest so you
        can always ask and get an answer instantly?
            Heap
        No, that's too weird.
            Do the values need to be stored in sorted order?
                SortedArray
            No, I'll be managing the order manually.
                Will the collection get really big, like more than 100 values?
                    Are you going to need to quickly access any value in the
                    collection based on its position?
                        Are you going to need to do any splicing, shifting, or
                        unshifting?
                            Array
                        No, won't need to splice, shift, or unshift.
                            Deque
                    No, don't need to access values by position.
                        Do you just need the values at either end of the
                        collection?
                            I need a FIFO queue.
                                Deque
                            I need a LIFO stack.
                                Array
                        I may need to access and manipulate values inside the
                        collection, away from the ends.
                            Is garbage collector churn more of a problem than
                            having to wait a long time whenever you modify the
                            inside of the collection?
                                Array
                            Having to wait for a long time when modifying the
                            inside of an array is definitely worse than waiting
                            a long time for the garbage collector.
                                List
                No, the collection is not going to get very big.
                    Array

Appendix W: Nice things about WeakMap that you get for free

    The values will be eleigible for garbage collection if you drop the key.

    If you have a native WeakMap, all the values will be eligible for garbage
    collection if you drop the WeakMap, or if it's only held by one of the
    values.

Appendix Y: The questions

    Shape:
    1.  A lookup table from keys to values (MAP)
    2.  A flat collection of values (NON-MAP) (default)
    3.  An iterator (ITERATOR)

    Unique:
    If NON-MAP
    Do you need a collection that can store more than one of the same value?
    UNIQUE / DUPLICATES (default)

    Iterable:
    If NO-EVICT and (NON-MAP or (MAP and NO-EVICT and SINGLE))
    Will you need to iterate over the collection?
    ITERABLE (default) / NON-ITERABLE

    Sorted:
    If NO-EVICT and ITERABLE and ((NON-MAP) or (MAP))
    Does the collection need to be kept in sorted order?
    SORTED / UNSORTED (default)

    Eviction:
    If MAP or (NON-MAP and UNIQUE)
    Do you want the collection to automatically evict values if it grows beyond
    a certain capacity? EVICT / NO-EVICT (default)

    Eviction style:
    If EVICT
    Is it better to forget a value if it wasn't used recently, or hasn't been
    used frequently?
    FREQUENCY / RECENCY

    Multi-value:
    If MAP and NO-EVICT
    Would it be useful for every value to implicitly be another collection, like
    an array.
    MULTI or SINGLE (default)

    Size:
    Is this collection going to be really big, more than 1000 values.
    BIG / SMALL (default)

    Key domain:
    If MAP and NO-EVICT and SINGLE
    What kinds of keys will this map have?
    1.  ANYTHING (default)
    2.  OBJECTS
    3.  NUMBERS
    4.  STRINGS
    5.  LIMITED-STRINGS

    available:

        Dict =     MAP and UNSORTED and NO-EVICT and SINGLE and STRINGS
        Object =   MAP and UNSORTED and NO-EVICT and SINGLE and LIMITED-STRINGS
        FastMap =  MAP and UNSORTED and NO-EVICT and SINGLE and NON-ITERABLE
        WeakMap =  MAP and UNSORTED and NO-EVICT and SINGLE and NON-ITERABLE and OBJECTS
        Map =      MAP and UNSORTED and NO-EVICT and SINGLE
        MultiMap = MAP and NO-EVICT and MULTI
        LruMap =   MAP and UNSORTED and EVICT and RECENCY
        LfuMap =   MAP and UNSORTED and EVICT and FREQUENCY
        LruSet =   NON-MAP and UNSORTED and UNIQUE and RECENCY
        LfuSet =   NON-MAP and UNSORTED and UNIQUE and FREQUENCY
        SortedMap = MAP and SORTED and ITERABLE and NO-EVICT and SINGLE and BIG
        SortedArrayMap = MAP and SORTED and ITERABLE and NO-EVICT

    Key Domain: strings, non-special strings, numbers, objects, heterogenous
    objects, heterogenous values.

Appendix Z: The multifarious perils of using objects as dictionaries and what to
do about them.

    Are you down for worrying about details of "__proto__",
    "hasOwnProperty", and all that
    Do you mind manually prefixing all your keys with "$"?
        Object with "$" key prefixes. You can use "in" to check for keys.
    Can you swear on a stack of first edition mint condition Silmarillions
    that the key will never be "__proto__"?
        How about "hasOwnProperty", also, browsers are not too old, right?
            You can use an object with bare keys and use "hasOwnProperty" to
            check.
        Do you mind manually prefixing all your keys with "$"?
        Otherwise, you can use a bare object and use
        Object.prototype.hasOwnProperty.call(object, key)

