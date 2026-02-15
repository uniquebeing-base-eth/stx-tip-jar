
;; STX Tip Jar Contract
;; A simple contract for creating tip jars and receiving STX tips

;; Error codes
(define-constant ERR-JAR-EXISTS (err u100))
(define-constant ERR-JAR-NOT-FOUND (err u101))
(define-constant ERR-NOT-OWNER (err u102))
(define-constant ERR-ZERO-AMOUNT (err u103))
(define-constant ERR-TRANSFER-FAILED (err u104))

;; Data maps
(define-map tip-jars
  { owner: principal }
  { balance: uint }
)

;; Read-only functions

;; Get the balance of a tip jar
(define-read-only (get-jar-balance (owner principal))
  (match (map-get? tip-jars { owner: owner })
    jar (ok (get balance jar))
    ERR-JAR-NOT-FOUND
  )
)

;; Check if a jar exists
(define-read-only (jar-exists (owner principal))
  (is-some (map-get? tip-jars { owner: owner }))
)

;; Public functions

;; Create a new tip jar for the caller
(define-public (create-jar)
  (let
    ((caller tx-sender))
    (asserts! (not (jar-exists caller)) ERR-JAR-EXISTS)
    (ok (map-set tip-jars { owner: caller } { balance: u0 }))
  )
)

;; Send a tip to a jar owner
(define-public (tip (owner principal) (amount uint))
  (begin
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (jar-exists owner) ERR-JAR-NOT-FOUND)
    ;; Transfer STX from sender to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    ;; Update the jar balance
    (let
      ((current-balance (default-to u0 (get balance (map-get? tip-jars { owner: owner })))))
      (ok (map-set tip-jars { owner: owner } { balance: (+ current-balance amount) }))
    )
  )
)

;; Withdraw all funds from your tip jar
(define-public (withdraw)
  (let
    (
      (caller tx-sender)
      (jar (unwrap! (map-get? tip-jars { owner: caller }) ERR-JAR-NOT-FOUND))
      (balance (get balance jar))
    )
    (asserts! (> balance u0) ERR-ZERO-AMOUNT)
    ;; Transfer STX from contract to owner
    (try! (as-contract (stx-transfer? balance tx-sender caller)))
    ;; Reset balance to zero
    (ok (map-set tip-jars { owner: caller } { balance: u0 }))
  )
)
