/**
 * @file assignments.ts
 * @description Assignment management for RCP assessment
 * 
 * This module handles the assignment of assessment areas and questions
 * to different employees within the organization. It provides functions
 * for assigning, tracking, and updating assignment status.
 */

import { AssessmentArea } from './questions';
import { AssessmentQuestion, getQuestionsByArea } from './questionBank';

/**
 * Assignment status options
 */
export type AssignmentStatus = 'not_started' | 'in_progress' | 'completed' | 'reviewed';

/**
 * Assignment interface for sections or individual questions
 */
export interface Assignment {
  id: string;                  // Unique identifier for the assignment
  area: AssessmentArea;        // Assessment area
  assignee: string;            // Email of the person assigned
  assignedBy: string;          // Email of the person who made the assignment
  assignedDate: string;        // Date when assigned
  dueDate?: string;            // Optional due date
  questionIds?: string[];      // Specific questions (if not the whole area)
  status: AssignmentStatus;    // Current status
  notes?: string;              // Optional notes about the assignment
  completedDate?: string;      // Date when completed (if applicable)
  reviewedBy?: string;         // Email of reviewer (if applicable)
  reviewedDate?: string;       // Date when reviewed (if applicable)
}

/**
 * User interface for assignees and assigners
 */
export interface User {
  email: string;               // Email address (unique identifier)
  name: string;                // Full name
  role: 'coordinator' | 'contributor' | 'reviewer'; // User role
  department?: string;         // Department/section
  title?: string;              // Job title
}

/**
 * Assignment store - In a real app, this would be in a database
 * For the MVP, we'll use localStorage to persist assignments
 */
class AssignmentStore {
  private storageKey = 'rcpAssignments';
  
  /**
   * Save assignments to localStorage
   * @param assignments Array of assignments to save
   */
  private saveAssignments(assignments: Assignment[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(assignments));
    }
  }
  
  /**
   * Get all assignments from localStorage
   * @returns Array of assignments or empty array if none found
   */
  getAllAssignments(): Assignment[] {
    if (typeof window === 'undefined') {
      return [];
    }
    
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return [];
    }
    
    try {
      return JSON.parse(data) as Assignment[];
    } catch (error) {
      console.error('Error parsing assignments:', error);
      return [];
    }
  }
  
  /**
   * Create a new assignment
   * @param assignment Assignment details
   * @returns Created assignment with generated ID
   */
  createAssignment(assignment: Omit<Assignment, 'id'>): Assignment {
    const assignments = this.getAllAssignments();
    
    // Generate a unique ID
    const id = `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newAssignment: Assignment = {
      ...assignment,
      id
    };
    
    assignments.push(newAssignment);
    this.saveAssignments(assignments);
    
    return newAssignment;
  }
  
  /**
   * Update an existing assignment
   * @param id Assignment ID
   * @param updates Partial assignment updates
   * @returns Updated assignment or null if not found
   */
  updateAssignment(id: string, updates: Partial<Assignment>): Assignment | null {
    const assignments = this.getAllAssignments();
    const index = assignments.findIndex(a => a.id === id);
    
    if (index === -1) {
      return null;
    }
    
    // Update assignment
    assignments[index] = {
      ...assignments[index],
      ...updates
    };
    
    this.saveAssignments(assignments);
    return assignments[index];
  }
  
  /**
   * Delete an assignment
   * @param id Assignment ID
   * @returns True if deleted, false if not found
   */
  deleteAssignment(id: string): boolean {
    const assignments = this.getAllAssignments();
    const index = assignments.findIndex(a => a.id === id);
    
    if (index === -1) {
      return false;
    }
    
    assignments.splice(index, 1);
    this.saveAssignments(assignments);
    return true;
  }
  
  /**
   * Get assignments for a specific area
   * @param area Assessment area
   * @returns Array of assignments for the area
   */
  getAssignmentsByArea(area: AssessmentArea): Assignment[] {
    return this.getAllAssignments().filter(a => a.area === area);
  }
  
  /**
   * Get assignments for a specific assignee
   * @param email Assignee email
   * @returns Array of assignments for the assignee
   */
  getAssignmentsByAssignee(email: string): Assignment[] {
    return this.getAllAssignments().filter(a => a.assignee === email);
  }
  
  /**
   * Get assignments by status
   * @param status Assignment status
   * @returns Array of assignments with the specified status
   */
  getAssignmentsByStatus(status: AssignmentStatus): Assignment[] {
    return this.getAllAssignments().filter(a => a.status === status);
  }
  
  /**
   * Get assignment that includes a specific question
   * @param questionId Question ID
   * @returns Assignment containing the question or null if not found
   */
  getAssignmentForQuestion(questionId: string): Assignment | null {
    const assignments = this.getAllAssignments();
    
    // Check area-wide assignments first (no questionIds specified)
    for (const assignment of assignments) {
      if (!assignment.questionIds) {
        // This is an area-wide assignment
        const areaQuestions = getQuestionsByArea(assignment.area);
        if (areaQuestions.some(q => q.id === questionId)) {
          return assignment;
        }
      }
    }
    
    // Check specific question assignments
    const specificAssignment = assignments.find(a => 
      a.questionIds && a.questionIds.includes(questionId)
    );
    
    return specificAssignment || null;
  }
  
  /**
   * Check if a question is assigned to anyone
   * @param questionId Question ID
   * @returns True if assigned, false otherwise
   */
  isQuestionAssigned(questionId: string): boolean {
    return this.getAssignmentForQuestion(questionId) !== null;
  }
  
  /**
   * Get all unique assignees
   * @returns Array of unique assignee emails
   */
  getAllAssignees(): string[] {
    const assignments = this.getAllAssignments();
    const assignees = new Set<string>();
    
    assignments.forEach(a => assignees.add(a.assignee));
    
    return Array.from(assignees);
  }
  
  /**
   * Clear all assignments (for testing or reset)
   */
  clearAllAssignments(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}

// Export a singleton instance of the assignment store
export const assignmentStore = new AssignmentStore();

/**
 * Users store - In a real app, this would be in a database
 * For the MVP, we'll use localStorage to persist users
 */
class UserStore {
  private storageKey = 'rcpUsers';
  
  /**
   * Save users to localStorage
   * @param users Array of users to save
   */
  private saveUsers(users: User[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    }
  }
  
  /**
   * Get all users from localStorage
   * @returns Array of users or empty array if none found
   */
  getAllUsers(): User[] {
    if (typeof window === 'undefined') {
      return [];
    }
    
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return [];
    }
    
    try {
      return JSON.parse(data) as User[];
    } catch (error) {
      console.error('Error parsing users:', error);
      return [];
    }
  }
  
  /**
   * Create a new user
   * @param user User details
   * @returns Created user
   */
  createUser(user: User): User {
    const users = this.getAllUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
      throw new Error(`User with email ${user.email} already exists`);
    }
    
    users.push(user);
    this.saveUsers(users);
    
    return user;
  }
  
  /**
   * Update an existing user
   * @param email User email
   * @param updates Partial user updates
   * @returns Updated user or null if not found
   */
  updateUser(email: string, updates: Partial<User>): User | null {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.email === email);
    
    if (index === -1) {
      return null;
    }
    
    // Email shouldn't be updated
    const { email: _, ...validUpdates } = updates;
    
    // Update user
    users[index] = {
      ...users[index],
      ...validUpdates
    };
    
    this.saveUsers(users);
    return users[index];
  }
  
  /**
   * Delete a user
   * @param email User email
   * @returns True if deleted, false if not found
   */
  deleteUser(email: string): boolean {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.email === email);
    
    if (index === -1) {
      return false;
    }
    
    users.splice(index, 1);
    this.saveUsers(users);
    return true;
  }
  
  /**
   * Get user by email
   * @param email User email
   * @returns User object or null if not found
   */
  getUserByEmail(email: string): User | null {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);
    
    return user || null;
  }
  
  /**
   * Get users by role
   * @param role User role
   * @returns Array of users with the specified role
   */
  getUsersByRole(role: User['role']): User[] {
    return this.getAllUsers().filter(u => u.role === role);
  }
  
  /**
   * Initialize with default users (for demo purposes)
   */
  initializeDefaultUsers(): void {
    const users = this.getAllUsers();
    
    // Only initialize if no users exist
    if (users.length === 0) {
      const defaultUsers: User[] = [
        {
          email: 'coordinator@example.gov.ca',
          name: 'Main Coordinator',
          role: 'coordinator',
          department: 'Risk and Compliance Office',
          title: 'Risk Assessment Coordinator'
        },
        {
          email: 'procurement@example.gov.ca',
          name: 'Procurement Manager',
          role: 'contributor',
          department: 'Procurement',
          title: 'Senior Procurement Officer'
        },
        {
          email: 'security@example.gov.ca',
          name: 'Security Officer',
          role: 'contributor',
          department: 'Security',
          title: 'Chief Security Officer'
        },
        {
          email: 'finance@example.gov.ca',
          name: 'Finance Director',
          role: 'contributor',
          department: 'Finance',
          title: 'Director of Financial Management'
        },
        {
          email: 'reviewer@example.gov.ca',
          name: 'Senior Reviewer',
          role: 'reviewer',
          department: 'Executive Office',
          title: 'Deputy Director'
        }
      ];
      
      this.saveUsers(defaultUsers);
    }
  }
  
  /**
   * Clear all users (for testing or reset)
   */
  clearAllUsers(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}

// Export a singleton instance of the user store
export const userStore = new UserStore();

/**
 * Creates a new area assignment
 * @param area Assessment area to assign
 * @param assignee Email of the person being assigned
 * @param assignedBy Email of the person making the assignment
 * @param dueDate Optional due date for the assignment
 * @param notes Optional notes about the assignment
 * @returns Created assignment
 */
export function assignArea(
  area: AssessmentArea,
  assignee: string,
  assignedBy: string,
  dueDate?: string,
  notes?: string
): Assignment {
  // Validate that users exist
  const assigneeUser = userStore.getUserByEmail(assignee);
  const assignerUser = userStore.getUserByEmail(assignedBy);
  
  if (!assigneeUser) {
    throw new Error(`Assignee with email ${assignee} not found`);
  }
  
  if (!assignerUser) {
    throw new Error(`Assigner with email ${assignedBy} not found`);
  }
  
  return assignmentStore.createAssignment({
    area,
    assignee,
    assignedBy,
    assignedDate: new Date().toISOString(),
    dueDate,
    status: 'not_started',
    notes
  });
}

/**
 * Creates a new question assignment for specific questions
 * @param area Assessment area
 * @param questionIds Array of question IDs to assign
 * @param assignee Email of the person being assigned
 * @param assignedBy Email of the person making the assignment
 * @param dueDate Optional due date for the assignment
 * @param notes Optional notes about the assignment
 * @returns Created assignment
 */
export function assignQuestions(
  area: AssessmentArea,
  questionIds: string[],
  assignee: string,
  assignedBy: string,
  dueDate?: string,
  notes?: string
): Assignment {
  // Validate that users exist
  const assigneeUser = userStore.getUserByEmail(assignee);
  const assignerUser = userStore.getUserByEmail(assignedBy);
  
  if (!assigneeUser) {
    throw new Error(`Assignee with email ${assignee} not found`);
  }
  
  if (!assignerUser) {
    throw new Error(`Assigner with email ${assignedBy} not found`);
  }
  
  // Validate that all questions belong to the specified area
  const areaQuestions = getQuestionsByArea(area);
  const areaQuestionIds = areaQuestions.map(q => q.id);
  
  const invalidQuestionIds = questionIds.filter(id => !areaQuestionIds.includes(id));
  if (invalidQuestionIds.length > 0) {
    throw new Error(`Questions ${invalidQuestionIds.join(', ')} do not belong to the ${area} area`);
  }
  
  return assignmentStore.createAssignment({
    area,
    questionIds,
    assignee,
    assignedBy,
    assignedDate: new Date().toISOString(),
    dueDate,
    status: 'not_started',
    notes
  });
}

/**
 * Updates the status of an assignment
 * @param assignmentId Assignment ID
 * @param status New status
 * @param notes Optional notes about the status update
 * @returns Updated assignment or null if not found
 */
export function updateAssignmentStatus(
  assignmentId: string,
  status: AssignmentStatus,
  notes?: string
): Assignment | null {
  const assignment = assignmentStore.getAllAssignments().find(a => a.id === assignmentId);
  
  if (!assignment) {
    return null;
  }
  
  const updates: Partial<Assignment> = { status };
  
  // Add completion date if status is 'completed'
  if (status === 'completed') {
    updates.completedDate = new Date().toISOString();
  }
  
  // Add notes if provided
  if (notes) {
    updates.notes = assignment.notes 
      ? `${assignment.notes}\n\n${new Date().toLocaleString()}: ${notes}`
      : `${new Date().toLocaleString()}: ${notes}`;
  }
  
  return assignmentStore.updateAssignment(assignmentId, updates);
}

/**
 * Reviews an assignment
 * @param assignmentId Assignment ID
 * @param reviewerEmail Email of the reviewer
 * @param notes Optional review notes
 * @returns Updated assignment or null if not found
 */
export function reviewAssignment(
  assignmentId: string,
  reviewerEmail: string,
  notes?: string
): Assignment | null {
  // Validate that reviewer exists
  const reviewer = userStore.getUserByEmail(reviewerEmail);
  
  if (!reviewer) {
    throw new Error(`Reviewer with email ${reviewerEmail} not found`);
  }
  
  const updates: Partial<Assignment> = {
    status: 'reviewed',
    reviewedBy: reviewerEmail,
    reviewedDate: new Date().toISOString()
  };
  
  // Add notes if provided
  if (notes) {
    updates.notes = notes;
  }
  
  return assignmentStore.updateAssignment(assignmentId, updates);
}

// Initialize default users when imported
if (typeof window !== 'undefined') {
  // Wait for window to be defined (client side)
  setTimeout(() => {
    userStore.initializeDefaultUsers();
  }, 0);
}
