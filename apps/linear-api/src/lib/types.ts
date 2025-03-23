export interface LinearLabel {
  id: string
  name: string
  color: string
}

export interface LinearProject {
  id: string
  name: string
  color: string
}

export interface LinearIssue {
  id: string
  title: string
  description?: string
  state: {
    id: string
    name: string
    type: string
    color: string
  }
  assignee: {
    id: string
    name: string
    email: string
  } | null
  labels?: LinearLabel[]
  project?: LinearProject
  createdAt: string
  updatedAt: string
}

export interface LinearResponse {
  viewer: {
    id: string
    name: string
    email: string
    organization: {
      id: string
      name: string
    }
  }
  issues: {
    nodes: LinearIssue[]
  }
  teams: {
    nodes: {
      id: string
      name: string
      key: string
    }[]
  }
}

