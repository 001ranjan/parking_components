import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  loginUser(data: { loginId: string; password: string }): Observable<any> {
    const url = `${environment.baseUrl}/auth/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, data, { headers });
  }

  // Parked vehicle data
  // parkedVehicleData(): Observable<any> {
  //   const url = `${environment.baseUrl}/parking`;
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.get(url, { headers });
  // }

  parkedVehicleData(): Observable<any> {
    const url = `${environment.baseUrl}/parking`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }

  // Parked vehicles by date range
  vehicleList(
    parkingId: string,
    page: number,
    orderBy: string,
    limit: number,
    filters?: any
  ): Observable<any> {
    // Start with base URL and required parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('orderBy', orderBy)
      .set('limit', limit.toString());
    
    // Add filter parameters if they exist
    if (filters) {
      if (filters.vehicleType) {
        params = params.set('vehicleTypeId', filters.vehicleType);
        console.log('Setting vehicleTypeId filter:', filters.vehicleType);
      }
      if (filters.inById) {
        params = params.set('operator', filters.inById);
        console.log('Setting operator filter:', filters.inById);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
        console.log('Setting status filter:', filters.status);
      }
      if (filters.from) {
        params = params.set('from', filters.from);
        console.log('Setting from date:', filters.from);
      }
      if (filters.to) {
        params = params.set('to', filters.to);
        console.log('Setting to date:', filters.to);
      }
    }

    const url = `${environment.baseUrl}/parking/${parkingId}/transaction`;
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    // console.log('Final API Request:');
    // console.log('URL:', url);
    // console.log('Headers:', headers);
    // console.log('Params:', params.toString());
    // console.log('Full URL with params:', `${url}?${params.toString()}`);
    
    return this.http.get(url, { headers, params });
  }

  // parking user
  parkingUserDetail(userId: string): Observable<any> {
    const url = `${environment.baseUrl}/user/teams/f5b0fc9f-ddde-4c3a-a25f-9ef679660db7`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }

  // Share vehicle data via email
  shareVehicleData(parkingId: string, shareRequest: {
    subject: string;
    emails: string[];
    fromDate: string;
    toDate: string;
    parkingId: string;
    operators: Record<string, boolean>;
    sessions: any[];
    attachments: string;
  }): Observable<any> {
    const url = `${environment.baseUrl}/parking/${parkingId}/transaction/share`;
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No authentication token found');
      return throwError(() => new Error('Authentication token not found'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    console.log('Making API request to:', url);
    console.log('Request headers:', headers);
    console.log('Request body:', shareRequest);

    return this.http.post(url, shareRequest, { headers }).pipe(
      catchError(error => {
        console.error('API Error:', error);
        if (error.status === 401) {
          console.error('Authentication failed. Token might be invalid or expired.');
        } else if (error.status === 403) {
          console.error('Access forbidden. Check user permissions.');
        } else if (error.status === 404) {
          console.error('Resource not found. Check parking ID.');
        }
        return throwError(() => error);
      })
    );
  }

  getPasses(parkingId: string, page: number, orderBy: string, limit: number, filters?: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    // Start with base URL and required parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('orderBy', orderBy)
      .set('limit', limit.toString());
    
    // Add filter parameters if they exist
    if (filters) {
      if (filters.vehicleType) {
        // Set both vehicleType and vehicleTypeId parameters
        params = params.set('vehicleType', filters.vehicleType);
        params = params.set('vehicleTypeId', filters.vehicleType);
        console.log('Setting vehicle type filters:', {
          vehicleType: filters.vehicleType,
          vehicleTypeId: filters.vehicleType
        });
      }
      if (filters.operator) {
        params = params.set('operatorId', filters.operator);
        console.log('Setting operator filter:', filters.operator);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
        console.log('Setting status filter:', filters.status);
      }
      if (filters.from) {
        params = params.set('fromDate', filters.from);
        console.log('Setting from date:', filters.from);
      }
      if (filters.to) {
        params = params.set('toDate', filters.to);
        console.log('Setting to date:', filters.to);
      }
    }

    // console.log('Making API request to:', `${this.baseUrl}/pass/${parkingId}`);
    // console.log('With parameters:', params.toString());

    return this.http.get(`${this.baseUrl}/pass/${parkingId}`, { headers, params });
  }

  // Utility function to format dates
  formatDate(date: Date | string, prefix?: string): string {
    if (!date) return '';
    
    const d = new Date(date);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = days[d.getDay()];
    const dateNum = d.getDate().toString().padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear().toString().slice(-2);
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    const formattedDate = `${day} ${dateNum} ${month}${year} ${formattedHours}:${minutes}${amPm}`;
    return prefix ? `${prefix} ${formattedDate}` : formattedDate;
  }
}
