import { BaseApiClient, PaginatedResponse } from "./BaseApiClient";
import type { Contact } from "@/types/models/Contact";

export interface ContactFilters {
  search?: string;
  companyId?: string;
  tags?: string[];
  isActive?: boolean;
  hasUpcomingFollowUp?: boolean;
}

export class ContactApiClient extends BaseApiClient {
  private readonly endpoint = "/contacts";

  async getContacts(
    page: number = 1,
    pageSize: number = 20,
    filters?: ContactFilters
  ): Promise<PaginatedResponse<Contact>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    return this.get<Contact>(`${this.endpoint}?${params}`);
  }

  async getContact(id: string): Promise<Contact> {
    const response = await this.get<Contact>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async createContact(
    contact: Omit<Contact, "id" | "createdAt" | "updatedAt">
  ): Promise<Contact> {
    const response = await this.post<Contact>(this.endpoint, contact);
    return response.data;
  }

  async updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
    const response = await this.put<Contact>(`${this.endpoint}/${id}`, contact);
    return response.data;
  }

  async deleteContact(id: string): Promise<void> {
    await this.delete(`${this.endpoint}/${id}`);
  }

  async bulkImport(contacts: Partial<Contact>[]): Promise<Contact[]> {
    const response = await this.post<Contact[]>(
      `${this.endpoint}/bulk-import`,
      { contacts }
    );
    return response.data;
  }

  async exportToExcel(filters?: ContactFilters): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.client.get(
      `${this.endpoint}/export?${params}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  }

  async getUpcomingFollowUps(days: number = 7): Promise<Contact[]> {
    const response = await this.get<Contact[]>(
      `${this.endpoint}/follow-ups?days=${days}`
    );
    return response.data;
  }
}
