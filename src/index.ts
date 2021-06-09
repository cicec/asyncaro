class Action {
  private pool: (() => Promise<void>)[] = []
  private executing: Promise<void>[] = []
  private $next?: Action
  private $previous?: Action

  constructor(previous?: Action) {
    this.$previous = previous
  }

  public get isEmpty() {
    return this.pool.length === 0 && this.executing.length === 0
  }

  public add(p: () => Promise<void>) {
    this.pool.push(p)

    let previous = this.$previous

    while (previous) {
      if (!previous.isEmpty) return

      previous = previous.$previous
    }

    this.execute()
  }

  public next() {
    const action = new Action(this)
    this.$next = action

    return action
  }

  public execute() {
    while (this.pool.length > 0) {
      const t = this.pool.shift()

      if (t) {
        const p = t()
        const e = p.then(() => {
          this.executing.splice(this.executing.indexOf(e), 1)

          if (this.executing.length === 0) {
            let next = this.$next

            while (next) {
              if (!next.isEmpty) {
                next.execute()
                return
              }

              next = next.$next
            }
          }
        })
        this.executing.push(e)
      }
    }
  }
}

export const action = () => {
  return new Action()
}
