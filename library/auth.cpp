#include <auth.hpp>


auth::app_ctx::app_ctx(std::string id, std::string name, std::string version, auth::status_e status, std::string created_on)
{
	this->m_id = id;
	this->m_name = name;
	this->m_version = version;
	this->m_status = status;
	this->m_created_on = created_on;
}

auth::app_ctx::~app_ctx()
{
	this->m_id.clear();
	this->m_name.clear();
	this->m_version.clear();
	this->m_status = auth::undetected; // mega ud
	this->m_created_on.clear();
}

auth::status_e auth::app_ctx::status()
{
	return this->m_status;
}

std::string auth::app_ctx::id()
{
	return this->m_id;
}

std::string auth::app_ctx::name()
{
	return this->m_name;
}

std::string auth::app_ctx::version()
{
	return this->m_version;
}

std::string auth::app_ctx::created_on()
{
	return this->m_created_on;
}

auth::license_ctx::license_ctx(std::string id, std::string license, std::string hwid, std::string expiry, std::string created_on, std::uint32_t duration)
{
	this->m_id = id;
	this->m_license = license;
	this->m_hwid = hwid;
	this->m_expiry = expiry;
	this->m_created_on = created_on;
	this->m_duration = duration;
}

std::uint32_t auth::license_ctx::deriveKey()
{
	std::uint32_t key = 0;
	for (std::uint32_t i = 0; i < this->m_license.length(); i++)
		key += this->m_license.at(i);

	return key;
}

auth::license_ctx::~license_ctx()
{
	this->m_id.clear();
	this->m_license.clear();
	this->m_hwid.clear();
	this->m_expiry.clear();
	this->m_created_on.clear();
	this->m_duration = 0;
}

std::string auth::license_ctx::id()
{
	return this->m_id;
}

std::string auth::license_ctx::license()
{
	return this->m_license;
}

std::string auth::license_ctx::hwid()
{
	return this->m_hwid;
}

std::string auth::license_ctx::expiry()
{
	return this->m_expiry;
}

std::string auth::license_ctx::created_on()
{
	return this->m_created_on;
}

auth::session_ctx::session_ctx(std::string token)
{
	this->m_token = token;
}

auth::session_ctx::~session_ctx()
{
	this->m_token.clear();
}

auth::secure_image auth::session_ctx::stream()
{
	std::string response;

	CURL* curl = curl_easy_init();

	if (curl)
	{

		char* url = reinterpret_cast<char*>(malloc(255));
		sprintf(url, "%s/backend/client/api/v1/module?token=%s", ENDPOINT, this->m_token.c_str());

		curl_easy_setopt(curl, CURLOPT_URL, url);
		curl_easy_setopt(curl, CURLOPT_HTTPGET, 1);

		curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_function);
		curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

		curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0);

		CURLcode res = curl_easy_perform(curl);
		free(url);
		curl_easy_cleanup(curl);
	}

	nlohmann::json data = nlohmann::json::parse(response);
	if (data["status"] == "success")
	{
		return auth::secure_image(data["image"].get<std::vector<std::uint32_t>>());
	}
	else
	{

		MessageBoxA(0, data["message"].get<std::string>().c_str(), "authentication", 0);
		exit(0);
	}
}

auth::secure_image::secure_image(std::vector<std::uint32_t> image)
{
	this->image = image;
}

auth::secure_image::~secure_image()
{
	this->image = {};
}

std::vector<std::uint32_t> auth::secure_image::decrypt()
{
	std::vector<std::uint32_t> output = this->image;

	std::uint32_t i = 0;
	for (std::uint32_t byte : output)
	{
		output.at(i) = output.at(i) ^ this->key;
		i++;
	}

	return output;
}

auth::secure_image auth::secure_image::set_key(std::uint32_t key)
{
	this->key = key;
	return *this;
}

std::size_t auth::write_function(void* data, std::size_t size, std::size_t nmemb, void* userdata)
{
	static_cast<std::string*>(userdata)->append((char*)data, size * nmemb);
	return size * nmemb;
}

auth::response_ctx auth::authenticate(std::string license)
{
	std::string response;

	CURL* curl = curl_easy_init();

	/*
	Extremely simple HWID check
	*/
	unsigned long nameSize = 16;
	char computerName[16];
	GetComputerNameA(computerName, &nameSize);

	char postdata[255];
	sprintf(postdata, "license=%s&token=%s", license.c_str(), computerName);

	if (curl)
	{

		curl_easy_setopt(curl, CURLOPT_URL, ENDPOINT"/backend/client/api/v1/authenticate");
		curl_easy_setopt(curl, CURLOPT_POSTFIELDS, postdata);

		curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_function);
		curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

		curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0);

		CURLcode res = curl_easy_perform(curl);
		curl_easy_cleanup(curl);
	}

	nlohmann::json data = nlohmann::json::parse(response);
	if (data["status"] == "success")
	{
		return auth::response_ctx(
			auth::license_ctx(
				data["license"]["id"].get<std::string>(), license, data["license"]["hwid"].get<std::string>(), data["license"]["expiry"].get<std::string>(), data["license"]["created_on"].get<std::string>(), data["license"]["duration"].get<std::uint32_t>()
			),
			auth::session_ctx(data["token"].get<std::string>()),
			auth::app_ctx(
				data["app"]["id"].get<std::string>(), data["app"]["name"].get<std::string>(), data["app"]["version"].get<std::string>(), data["app"]["status"].get<auth::status_e>(), data["app"]["created_on"].get<std::string>()
			),
			true
		);
	}
	else
	{
		if (data["message"].get<std::string>().find("Retry auth process") != std::string::npos)
		{
			return authenticate(license);
		}
		else
		{
			MessageBoxA(0, data["message"].get<std::string>().c_str(), "authentication", 0);
			exit(0);
		}
	}

	return auth::response_ctx();
}

auth::response_ctx::response_ctx(auth::license_ctx license, auth::session_ctx session, auth::app_ctx app, bool success)
{
	this->m_license = license;
	this->m_session = session;
	this->m_app = app;
	this->m_success = success;
}

auth::license_ctx auth::response_ctx::license()
{
	return this->m_license;
}

auth::session_ctx auth::response_ctx::session()
{
	return this->m_session;
}

auth::app_ctx auth::response_ctx::app()
{
	return this->m_app;
}

bool auth::response_ctx::succeeded()
{
	return this->m_success;
}
