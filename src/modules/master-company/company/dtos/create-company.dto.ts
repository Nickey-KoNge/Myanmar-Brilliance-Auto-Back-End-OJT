//src/modules/master-company/company/dtos/create-company.dto.ts
export class CreateCompanyDto {
  company_name: string;
  reg_number: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  street_address: string;
  website_url: string;
  establish_year: Date;
  reg_exp_date: Date;
  image: string;
  status: string;
}
